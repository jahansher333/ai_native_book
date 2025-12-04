---
title: "Manipulation"
description: "Implement robotic grasping, motion planning, and object manipulation"
module_id: "module-4"
sidebar_position: 5
tags: ["manipulation", "grasping", "motion-planning", "object-interaction"]
difficulty: advanced
estimated_minutes: 25
---

# Manipulation

## Learning Objectives

By the end of this section, you will be able to:
- Design and implement grasp planning algorithms
- Use motion planning frameworks like MoveIt 2
- Implement object detection for grasping
- Handle force and torque feedback
- Plan complex manipulation sequences
- Optimize for real-world gripper constraints
- Integrate perception and manipulation

## Introduction to Robotic Manipulation

Manipulation is the robot's ability to physically interact with objects. It requires coordinating perception, planning, and control to grasp objects, manipulate them, and place them safely. This section covers the essential concepts and implementations.

### Manipulation Pipeline

```
Object Detection
    ↓
Grasp Planning
    ├── Estimate graspable points
    ├── Evaluate grasp quality
    └── Rank candidates
    ↓
Motion Planning
    ├── Plan arm trajectory
    ├── Avoid collisions
    └── Respect joint limits
    ↓
Gripper Control
    ├── Approach object
    ├── Close gripper
    └── Monitor force
    ↓
Execution
    ├── Follow trajectory
    ├── Handle perturbations
    └── Confirm grasp success
```

## Grasp Planning

### Antipodal Grasp Analysis

```python
import numpy as np
from scipy.spatial import ConvexHull

class GraspPlanner:
    def __init__(self, gripper_width=0.08, max_depth=0.05):
        """
        Initialize grasp planner

        Args:
            gripper_width: Maximum gripper opening (meters)
            max_depth: Maximum grip depth
        """
        self.gripper_width = gripper_width
        self.max_depth = max_depth

    def find_grasps(self, point_cloud, object_points=None):
        """
        Find viable grasps for an object

        Args:
            point_cloud: Complete scene point cloud
            object_points: Points belonging to target object

        Returns:
            List of grasp candidates with scores
        """
        grasps = []

        # Get object center of mass
        com = object_points.mean(axis=0) if object_points is not None else point_cloud.mean(axis=0)

        # Sample candidate grasp points on object surface
        if object_points is not None:
            surface_points = object_points
        else:
            surface_points = point_cloud

        # For each potential grasp location
        for i in range(0, len(surface_points), max(1, len(surface_points)//50)):
            point = surface_points[i]

            # Find antipodal pairs (opposite sides of object)
            antipodal_pairs = self._find_antipodal_pairs(
                surface_points, point, com
            )

            for pair in antipodal_pairs:
                grasp = {
                    'position': point,
                    'approach_direction': pair['direction'],
                    'grasp_width': pair['width'],
                    'quality': self._evaluate_grasp_quality(pair),
                    'contact_points': pair['contacts']
                }

                if grasp['quality'] > 0.1:  # Threshold
                    grasps.append(grasp)

        # Sort by quality
        grasps = sorted(grasps, key=lambda g: g['quality'], reverse=True)

        return grasps[:10]  # Return top 10

    def _find_antipodal_pairs(self, surface_points, grasp_point, com):
        """Find antipodal grasp pairs"""
        antipodal = []

        # Vector from COM to grasp point
        approach = grasp_point - com
        approach = approach / np.linalg.norm(approach)

        # Search opposite side of object
        distances = np.linalg.norm(surface_points - grasp_point, axis=1)
        opposite_idx = np.argsort(-distances)  # Sort descending

        for idx in opposite_idx[:100]:  # Check top 100 furthest points
            opposite_point = surface_points[idx]

            # Distance between contact points
            width = np.linalg.norm(opposite_point - grasp_point)

            if width <= self.gripper_width:
                # Normal at grasp point
                normal1 = self._estimate_normal(surface_points, grasp_point)
                normal2 = self._estimate_normal(surface_points, opposite_point)

                # Check if normals point toward each other (closure)
                closure = np.dot(normal1, -normal2)

                if closure > 0.5:  # Good closure
                    antipodal.append({
                        'direction': approach,
                        'width': width,
                        'contacts': [grasp_point, opposite_point],
                        'normals': [normal1, normal2],
                        'closure': closure
                    })

        return antipodal

    def _estimate_normal(self, points, query_point, k=10):
        """Estimate surface normal at point"""
        # Find k nearest neighbors
        distances = np.linalg.norm(points - query_point, axis=1)
        nearest_idx = np.argsort(distances)[:k]
        neighbors = points[nearest_idx]

        # PCA to find normal
        centered = neighbors - neighbors.mean(axis=0)
        _, _, Vt = np.linalg.svd(centered)
        normal = Vt[-1]  # Smallest singular vector

        return normal / np.linalg.norm(normal)

    def _evaluate_grasp_quality(self, grasp_pair):
        """
        Evaluate grasp quality

        Factors:
        - Closure: How well normals point toward each other
        - Width: Optimal grip width (not too small, not too large)
        - Stability: Resistance to disturbances
        """
        closure_score = grasp_pair['closure']
        width = grasp_pair['width']

        # Width score (prefer mid-range)
        width_score = 1.0 - abs(width - self.gripper_width/2) / (self.gripper_width/2)

        # Combined score
        quality = 0.6 * closure_score + 0.4 * width_score

        return quality
```

## Motion Planning with MoveIt 2

### MoveIt 2 Integration

```python
import rclpy
from moveit_msgs.action import MoveGroup
from rclpy.action import ActionClient

class ManipulationPlanner:
    def __init__(self):
        """Initialize MoveIt 2 motion planner"""
        self.node = rclpy.create_node('manipulation_planner')

        # Connect to MoveIt 2
        self.move_group_client = ActionClient(
            self.node,
            MoveGroup,
            '/move_group'
        )

    def plan_trajectory(self, target_pose, planning_time=5.0):
        """
        Plan trajectory to target pose

        Args:
            target_pose: Target end-effector pose (7D: position + quaternion)
            planning_time: Maximum planning time

        Returns:
            Trajectory if successful
        """
        goal = MoveGroup.Goal()
        goal.request.workspace_parameters.header.frame_id = "world"
        goal.request.workspace_parameters.min_corner.x = -1.0
        goal.request.workspace_parameters.min_corner.y = -1.0
        goal.request.workspace_parameters.min_corner.z = -1.0
        goal.request.workspace_parameters.max_corner.x = 1.0
        goal.request.workspace_parameters.max_corner.y = 1.0
        goal.request.workspace_parameters.max_corner.z = 1.0

        # Set target
        goal.request.goal_constraints.append(
            self._create_pose_constraint(target_pose)
        )

        goal.request.allowed_planning_time = planning_time
        goal.request.num_planning_attempts = 5

        # Send goal
        future = self.move_group_client.send_goal_async(goal)

        return future

    def _create_pose_constraint(self, target_pose):
        """Create pose constraint for planning"""
        from moveit_msgs.msg import Constraints, PositionConstraint, OrientationConstraint
        from geometry_msgs.msg import Vector3

        constraints = Constraints()

        # Position constraint
        pos_constraint = PositionConstraint()
        pos_constraint.header.frame_id = "world"
        pos_constraint.link_name = "end_effector"
        pos_constraint.target_point_offset = Vector3(x=0, y=0, z=0)
        # ... set bounds

        # Orientation constraint
        ori_constraint = OrientationConstraint()
        ori_constraint.header.frame_id = "world"
        ori_constraint.link_name = "end_effector"
        ori_constraint.orientation.x = target_pose[3]
        ori_constraint.orientation.y = target_pose[4]
        ori_constraint.orientation.z = target_pose[5]
        ori_constraint.orientation.w = target_pose[6]
        # ... set tolerance

        constraints.position_constraints.append(pos_constraint)
        constraints.orientation_constraints.append(ori_constraint)

        return constraints
```

### Collision Avoidance

```python
class CollisionAwareMotionPlanner:
    def __init__(self):
        self.planning_scene_diff_client = None
        self.collision_objects = []

    def add_collision_object(self, obj_id, obj_pose, dimensions):
        """Add object to planning scene"""
        from moveit_msgs.msg import CollisionObject
        from shape_msgs.msg import SolidPrimitive
        from geometry_msgs.msg import Pose

        obj = CollisionObject()
        obj.id = obj_id
        obj.header.frame_id = "world"
        obj.operation = CollisionObject.ADD

        # Add box primitive
        primitive = SolidPrimitive()
        primitive.type = SolidPrimitive.BOX
        primitive.dimensions = dimensions

        obj.primitives.append(primitive)

        pose = Pose()
        pose.position.x = obj_pose[0]
        pose.position.y = obj_pose[1]
        pose.position.z = obj_pose[2]
        # ... set orientation

        obj.primitive_poses.append(pose)
        self.collision_objects.append(obj)

    def plan_with_collision_avoidance(self, start_pose, target_pose):
        """Plan trajectory avoiding collisions"""
        # Add objects to planning scene
        # Then use MoveIt 2 planner which respects scene
        pass
```

## Gripper Control

### Gripper Command Interface

```python
import rclpy
from std_msgs.msg import Float64

class GripperController:
    def __init__(self, gripper_command_topic="/gripper_command"):
        self.node = rclpy.create_node('gripper_controller')

        self.gripper_pub = self.node.create_publisher(
            Float64,
            gripper_command_topic,
            10
        )

        self.max_effort = 50.0  # Newtons

    def open_gripper(self, width=0.08):
        """Open gripper to specified width"""
        msg = Float64()
        msg.data = width
        self.gripper_pub.publish(msg)

    def close_gripper(self, effort=None):
        """Close gripper with specified effort"""
        if effort is None:
            effort = self.max_effort

        # Send command to close
        msg = Float64()
        msg.data = 0.0  # Fully closed
        self.gripper_pub.publish(msg)

    def grasp_object(self, object_width, max_effort=None):
        """Execute grasp with object-specific parameters"""
        if max_effort is None:
            max_effort = self.max_effort

        # Approach width (slightly wider than object)
        self.open_gripper(object_width + 0.01)
        rclpy.spin_once(self.node)  # Wait for command execution
        import time
        time.sleep(1.0)

        # Grasp (close with force control)
        msg = Float64()
        msg.data = 0.0
        self.gripper_pub.publish(msg)

        # Monitor force feedback
        time.sleep(0.5)

    def estimate_object_weight(self):
        """Estimate object weight from gripper effort"""
        # This would require force/torque sensor feedback
        pass
```

### Force Feedback Control

```python
from sensor_msgs.msg import WrenchStamped

class ForceControlledGripper:
    def __init__(self):
        self.node = rclpy.create_node('force_gripper')

        # Subscribe to F/T sensor
        self.ft_sub = self.node.create_subscription(
            WrenchStamped,
            '/gripper/wrench',
            self.ft_callback,
            10
        )

        self.current_force = 0.0
        self.gripper_pub = self.node.create_publisher(
            Float64,
            '/gripper_command',
            10
        )

    def ft_callback(self, msg):
        """Update force measurement"""
        # Sum of gripper forces
        self.current_force = abs(msg.wrench.force.x) + abs(msg.wrench.force.y)

    def grasp_with_force_control(self, target_force=20.0, max_closure_time=5.0):
        """
        Grasp with constant force feedback

        Args:
            target_force: Target grip force in Newtons
            max_closure_time: Maximum time to reach target force
        """
        import time

        start_time = time.time()
        closure_fraction = 0.0

        while time.time() - start_time < max_closure_time:
            if self.current_force >= target_force:
                print(f"Grasp achieved with force: {self.current_force:.1f}N")
                break

            # Increase closure
            closure_fraction += 0.01
            closure_fraction = min(closure_fraction, 1.0)

            msg = Float64()
            msg.data = closure_fraction
            self.gripper_pub.publish(msg)

            time.sleep(0.1)
        else:
            print(f"Warning: Did not reach target force. Current: {self.current_force:.1f}N")
```

## Manipulation Sequences

### Pick and Place

```python
class PickAndPlaceController:
    def __init__(self):
        self.manipulator = ManipulationPlanner()
        self.gripper = GripperController()
        self.grasp_planner = GraspPlanner()

    def pick_and_place(self, object_id, source_pose, target_pose):
        """
        Execute pick and place sequence

        Args:
            object_id: ID of object to grasp
            source_pose: Current location of object
            target_pose: Desired placement location
        """
        # Phase 1: Move to pre-grasp
        pre_grasp = source_pose.copy()
        pre_grasp[2] += 0.1  # 10cm above object

        print("Moving to pre-grasp...")
        self._move_to_pose(pre_grasp)

        # Phase 2: Open gripper
        print("Opening gripper...")
        self.gripper.open_gripper(width=0.08)

        # Phase 3: Move to grasp
        print("Moving to grasp...")
        self._move_to_pose(source_pose)

        # Phase 4: Close gripper
        print("Closing gripper...")
        self.gripper.close_gripper()

        # Phase 5: Lift object
        lift_pose = source_pose.copy()
        lift_pose[2] += 0.15  # Lift 15cm

        print("Lifting object...")
        self._move_to_pose(lift_pose)

        # Phase 6: Move to placement location
        pre_place = target_pose.copy()
        pre_place[2] += 0.1

        print("Moving to placement location...")
        self._move_to_pose(pre_place)

        # Phase 7: Lower object
        print("Lowering object...")
        self._move_to_pose(target_pose)

        # Phase 8: Open gripper
        print("Releasing object...")
        self.gripper.open_gripper(width=0.08)

        # Phase 9: Retract
        retract_pose = target_pose.copy()
        retract_pose[2] += 0.15

        print("Retracting...")
        self._move_to_pose(retract_pose)

        print("Pick and place complete!")

    def _move_to_pose(self, target_pose):
        """Execute motion to target pose"""
        future = self.manipulator.plan_trajectory(target_pose)
        # Wait for execution
```

## Manipulation with Vision

### Vision-Guided Grasping

```python
from sensor_msgs.msg import Image
from cv_bridge import CvBridge

class VisionGuidedGrasping:
    def __init__(self):
        self.node = rclpy.create_node('vision_guided_grasping')
        self.bridge = CvBridge()

        # Subscribe to camera
        self.image_sub = self.node.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            10
        )

        self.latest_image = None
        self.grasp_planner = GraspPlanner()
        self.manipulator = PickAndPlaceController()

    def image_callback(self, msg):
        """Update latest image"""
        self.latest_image = self.bridge.imgmsg_to_cv2(msg)

    def grasp_detected_object(self):
        """Detect and grasp object in view"""
        if self.latest_image is None:
            return False

        # Detect object
        object_mask = self._detect_object()
        if object_mask is None:
            return False

        # Get 3D point cloud for object
        point_cloud = self._get_point_cloud_from_mask(object_mask)

        # Plan grasps
        grasps = self.grasp_planner.find_grasps(point_cloud)
        if not grasps:
            return False

        # Select best grasp
        best_grasp = grasps[0]

        # Convert to robot frame
        grasp_pose = self._grasp_to_pose(best_grasp)

        # Execute grasp
        self.manipulator.pick_and_place(
            "detected_object",
            grasp_pose,
            target_pose=[0, 0, 0.5, 0, 0, 0, 1]
        )

        return True

    def _detect_object(self):
        """Detect object in image"""
        # Simple color-based segmentation
        pass

    def _get_point_cloud_from_mask(self, mask):
        """Get 3D point cloud from 2D mask"""
        pass

    def _grasp_to_pose(self, grasp):
        """Convert grasp to end-effector pose"""
        pass
```

## Key Takeaways

- Antipodal grasp planning provides robust contact points for object lifting
- Motion planning with collision avoidance ensures safe robot trajectories
- Force feedback enables reliable grasp execution
- Vision-guided grasping enables flexible object manipulation
- Well-structured manipulation sequences are essential for real-world reliability
- Integration of perception and control improves overall performance

## Next Steps

1. [Build Capstone Project](./capstone-project.md) - Integrate all modules into complete system

## Further Reading

- [Dex-Net: Grasp Quality CNN](https://arxiv.org/abs/1703.09312)
- [MoveIt 2 Documentation](https://moveit.ros.org/)
- [Robotic Manipulation Survey](https://arxiv.org/abs/1012.3744)
- [Grasp Planning Tutorial](http://docs.ros.org/en/humble/Tutorials/Intermediate/Tf2/Tf2-Tutorial.html)
