---
title: "Unity Integration"
description: "Leverage Unity's graphics engine for high-fidelity visualization alongside Gazebo physics simulation"
module_id: "module-2"
sidebar_position: 4
tags: ["unity", "visualization", "graphics", "digital-twin"]
difficulty: advanced
estimated_minutes: 30
---

# Unity Integration

## Learning Objectives

By the end of this section, you will be able to:
- Understand the architecture of Gazebo-Unity integration
- Set up Unity with ROS 2 communication
- Import and visualize robot models in Unity
- Synchronize physics between Gazebo and Unity
- Create interactive visualizations and dashboards
- Implement real-time sensor data visualization
- Deploy standalone visualization applications

## Introduction to Unity-Gazebo Integration

While Gazebo provides excellent physics simulation, its graphics engine is relatively basic. Unity excels at real-time 3D graphics, animations, and user interface design. By integrating the two, you get the best of both worlds: accurate physics simulation from Gazebo with stunning visual feedback from Unity.

### Integration Architecture

```
┌─────────────────────────────────────────────────┐
│           Gazebo Simulation                      │
│  (Physics, Sensors, ROS 2 Communication)        │
└────────────────┬────────────────────────────────┘
                 │
         ROS 2 Topics/Services
                 │
┌────────────────▼────────────────────────────────┐
│        ROS 2 Bridge / ROS 2 TCP Endpoint       │
└────────────────┬────────────────────────────────┘
                 │
         TCP/UDP Communication
                 │
┌────────────────▼────────────────────────────────┐
│           Unity Application                      │
│  (Visualization, UI, Data Logging)              │
└─────────────────────────────────────────────────┘
```

### When to Use Unity Integration

- **High-Fidelity Visualization**: Stakeholder demos and presentations
- **Complex Scenarios**: Multi-robot environments with rich interactions
- **Operator Interfaces**: Teleoperation and remote monitoring dashboards
- **Training Applications**: Interactive learning environments
- **Data Analysis**: Real-time visualization of sensor data and metrics

## Setting Up ROS 2 Communication in Unity

### Installation and Setup

1. **Install Unity** (2021.3+ LTS recommended)
2. **Install ROS 2 for Windows** (if developing on Windows) or Linux
3. **Clone the ROS 2 for Unity package**:

```bash
cd your_unity_project_assets
git clone https://github.com/Unity-Technologies/ROS2-For-Unity ROS2
```

### Basic ROS 2 Node in Unity

```csharp
using ROS2;
using std_msgs.msg;

public class ROS2Initializer : MonoBehaviour
{
    private RCLdotnet ros2Node;

    void Start()
    {
        // Initialize ROS 2
        RCL_RET ret = RCLdotnet.Init();
        if (ret != RCL_RET.OK)
        {
            Debug.LogError("ROS2 initialization failed");
            return;
        }

        // Create a node
        ros2Node = RCLdotnet.CreateNode("unity_visualizer");
        Debug.Log("ROS2 node created: unity_visualizer");

        // Start spinning in a coroutine
        StartCoroutine(SpinROS2());
    }

    IEnumerator SpinROS2()
    {
        while (Application.isPlaying)
        {
            RCLdotnet.SpinOnce(ros2Node, 0);
            yield return null;
        }
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

## Subscribing to Robot State

### Joint State Visualization

```csharp
using ROS2;
using sensor_msgs.msg;
using UnityEngine;

public class RobotStateVisualizer : MonoBehaviour
{
    public Transform[] jointTransforms;
    private RCLdotnet ros2Node;
    private ISubscription<JointState> jointStateSubscription;

    void Start()
    {
        // Create node
        ros2Node = RCLdotnet.CreateNode("robot_visualizer");

        // Subscribe to joint states
        jointStateSubscription = ros2Node.CreateSubscription<JointState>(
            "/joint_states",
            msg => OnJointStateReceived(msg)
        );
    }

    void OnJointStateReceived(JointState msg)
    {
        // Update each joint's rotation based on received state
        for (int i = 0; i < msg.Name.Count && i < jointTransforms.Length; i++)
        {
            float angle = (float)msg.Position[i];
            jointTransforms[i].localRotation = Quaternion.Euler(0, angle * Mathf.Rad2Deg, 0);
        }
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

## Publishing Control Commands

### Sending Actuator Commands from Unity

```csharp
using ROS2;
using std_msgs.msg;
using UnityEngine;

public class RobotController : MonoBehaviour
{
    private RCLdotnet ros2Node;
    private IPublisher<Float64MultiArray> commandPublisher;

    void Start()
    {
        ros2Node = RCLdotnet.CreateNode("unity_controller");

        // Create publisher for joint commands
        commandPublisher = ros2Node.CreatePublisher<Float64MultiArray>(
            "/forward_position_controller/commands"
        );
    }

    void Update()
    {
        // Example: send commands when user presses keys
        if (Input.GetKeyDown(KeyCode.Space))
        {
            SendJointCommand(new double[] { 0.5, -0.5, 0.0 });
        }
    }

    void SendJointCommand(double[] positions)
    {
        var msg = new Float64MultiArray();
        msg.Data = new double[positions.Length];
        System.Array.Copy(positions, msg.Data, positions.Length);

        commandPublisher.Publish(msg);
        Debug.Log("Joint command sent");
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

## Visualizing Sensor Data

### Real-time Camera Feed Display

```csharp
using ROS2;
using sensor_msgs.msg;
using UnityEngine;
using UnityEngine.UI;

public class CameraFeedVisualizer : MonoBehaviour
{
    public RawImage displayImage;
    private RCLdotnet ros2Node;
    private ISubscription<Image> imageSubscription;
    private Texture2D texture;

    void Start()
    {
        ros2Node = RCLdotnet.CreateNode("camera_visualizer");

        // Subscribe to camera image topic
        imageSubscription = ros2Node.CreateSubscription<Image>(
            "/camera/image_raw",
            OnImageReceived
        );
    }

    void OnImageReceived(Image msg)
    {
        // Create texture if needed
        if (texture == null || texture.width != (int)msg.Width || texture.height != (int)msg.Height)
        {
            texture = new Texture2D((int)msg.Width, (int)msg.Height, TextureFormat.RGB24, false);
        }

        // Convert ROS image message to texture
        byte[] imageData = new byte[msg.Data.Count];
        for (int i = 0; i < msg.Data.Count; i++)
        {
            imageData[i] = msg.Data[i];
        }

        texture.LoadRawTextureData(imageData);
        texture.Apply();

        displayImage.texture = texture;
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

### LiDAR Point Cloud Visualization

```csharp
using ROS2;
using sensor_msgs.msg;
using UnityEngine;

public class PointCloudVisualizer : MonoBehaviour
{
    public Material pointMaterial;
    private Mesh pointCloudMesh;
    private RCLdotnet ros2Node;
    private ISubscription<PointCloud2> pointCloudSubscription;

    void Start()
    {
        ros2Node = RCLdotnet.CreateNode("pointcloud_visualizer");

        // Subscribe to point cloud
        pointCloudSubscription = ros2Node.CreateSubscription<PointCloud2>(
            "/scan_cloud",
            OnPointCloudReceived
        );

        // Create mesh for rendering
        pointCloudMesh = new Mesh();
        GetComponent<MeshFilter>().mesh = pointCloudMesh;
        GetComponent<MeshRenderer>().material = pointMaterial;
    }

    void OnPointCloudReceived(PointCloud2 msg)
    {
        // Parse point cloud data
        int numPoints = (int)(msg.Width * msg.Height);
        Vector3[] vertices = new Vector3[numPoints];

        // Extract XYZ coordinates from point cloud
        int offset = 0;
        for (int i = 0; i < numPoints; i++)
        {
            int byteIndex = offset;
            float x = System.BitConverter.ToSingle(System.Convert.FromBase64String(msg.Data[i].ToString()), 0);
            float y = System.BitConverter.ToSingle(System.Convert.FromBase64String(msg.Data[i].ToString()), 4);
            float z = System.BitConverter.ToSingle(System.Convert.FromBase64String(msg.Data[i].ToString()), 8);

            vertices[i] = new Vector3(x, y, z);
            offset += 12; // 3 floats * 4 bytes
        }

        // Update mesh
        pointCloudMesh.Clear();
        pointCloudMesh.vertices = vertices;
        int[] indices = new int[numPoints];
        for (int i = 0; i < numPoints; i++) indices[i] = i;
        pointCloudMesh.SetIndices(indices, MeshTopology.Points, 0);
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

## Creating Interactive Dashboards

### Robot Status Display

```csharp
using ROS2;
using sensor_msgs.msg;
using nav_msgs.msg;
using UnityEngine;
using UnityEngine.UI;

public class RobotDashboard : MonoBehaviour
{
    // UI Elements
    public Text batteryText;
    public Text positionText;
    public Text velocityText;
    public Image batteryBar;

    private RCLdotnet ros2Node;
    private float currentBattery = 100f;
    private Vector3 currentPosition = Vector3.zero;
    private Vector3 currentVelocity = Vector3.zero;

    void Start()
    {
        ros2Node = RCLdotnet.CreateNode("robot_dashboard");

        // Subscribe to various topics
        ros2Node.CreateSubscription<Odometry>(
            "/odom",
            msg => OnOdometryReceived(msg)
        );

        ros2Node.CreateSubscription<JointState>(
            "/joint_states",
            msg => OnJointStateReceived(msg)
        );
    }

    void OnOdometryReceived(Odometry msg)
    {
        currentPosition = new Vector3(
            (float)msg.Pose.Pose.Position.X,
            (float)msg.Pose.Pose.Position.Y,
            (float)msg.Pose.Pose.Position.Z
        );

        currentVelocity = new Vector3(
            (float)msg.Twist.Twist.Linear.X,
            (float)msg.Twist.Twist.Linear.Y,
            (float)msg.Twist.Twist.Linear.Z
        );
    }

    void OnJointStateReceived(JointState msg)
    {
        // Estimate battery level based on effort (simplified)
        float totalEffort = 0;
        foreach (var effort in msg.Effort)
        {
            totalEffort += (float)effort;
        }

        currentBattery = Mathf.Max(0, currentBattery - totalEffort * 0.001f);
    }

    void Update()
    {
        // Update UI
        if (positionText != null)
        {
            positionText.text = $"Pos: ({currentPosition.x:F2}, {currentPosition.y:F2}, {currentPosition.z:F2})";
        }

        if (velocityText != null)
        {
            velocityText.text = $"Vel: {currentVelocity.magnitude:F2} m/s";
        }

        if (batteryText != null)
        {
            batteryText.text = $"Battery: {currentBattery:F1}%";
        }

        if (batteryBar != null)
        {
            batteryBar.fillAmount = currentBattery / 100f;
        }
    }

    void OnDestroy()
    {
        RCLdotnet.Dispose();
    }
}
```

## Model Import and Setup

### Importing Robot URDF Models

```csharp
using UnityEngine;
using UnityEditor;
using System.IO;

public class URDFImporter
{
    [MenuItem("Assets/Import URDF")]
    public static void ImportURDF()
    {
        string urdfPath = EditorUtility.OpenFilePanel("Select URDF file", "", "urdf");
        if (urdfPath.Length == 0) return;

        // Parse URDF and create GameObject hierarchy
        URDFParser parser = new URDFParser();
        GameObject robotModel = parser.Parse(urdfPath);

        // Add mesh colliders and rigid bodies
        SetupPhysics(robotModel);

        // Add to scene
        PrefabUtility.SaveAsPrefabAsset(robotModel,
            "Assets/Models/" + Path.GetFileNameWithoutExtension(urdfPath) + ".prefab");
    }

    static void SetupPhysics(GameObject obj)
    {
        foreach (Transform child in obj.GetComponentsInChildren<Transform>())
        {
            // Add colliders
            if (child.GetComponent<Collider>() == null)
            {
                child.gameObject.AddComponent<MeshCollider>();
            }

            // Add rigid body for simulation
            if (child.GetComponent<Rigidbody>() == null && child.childCount == 0)
            {
                Rigidbody rb = child.gameObject.AddComponent<Rigidbody>();
                rb.useGravity = false;
                rb.isKinematic = true;
            }
        }
    }
}
```

## Performance Optimization

### LOD System for Complex Models

```csharp
using UnityEngine;

public class AdaptiveVisualQuality : MonoBehaviour
{
    public LODGroup lodGroup;
    private float updateInterval = 0.5f;
    private float lastUpdateTime = 0;

    void Update()
    {
        if (Time.time - lastUpdateTime < updateInterval) return;
        lastUpdateTime = Time.time;

        // Adjust LOD based on frame rate
        int targetLOD = 0;
        if (Time.deltaTime > 0.016f) // ~60 FPS threshold
        {
            targetLOD = 2; // Lower quality
        }

        LOD[] lods = lodGroup.GetLODs();
        for (int i = 0; i < lods.Length; i++)
        {
            foreach (Renderer renderer in lods[i].renderers)
            {
                renderer.enabled = (i == targetLOD);
            }
        }
    }
}
```

### Efficient Data Subscription Management

```csharp
public class SubscriptionManager : MonoBehaviour
{
    private Dictionary<string, ISubscription> subscriptions;
    private bool enableHighBandwidthTopics = true;

    void Start()
    {
        subscriptions = new Dictionary<string, ISubscription>();

        if (enableHighBandwidthTopics)
        {
            SubscribeToSensorData();
        }
        else
        {
            SubscribeToLowBandwidthTopics();
        }
    }

    void SubscribeToSensorData()
    {
        // Subscribe to camera, point clouds, etc.
        Debug.Log("Subscribing to high-bandwidth topics");
    }

    void SubscribeToLowBandwidthTopics()
    {
        // Only subscribe to essential topics
        Debug.Log("Subscribing to low-bandwidth topics");
    }

    public void ToggleBandwidth()
    {
        enableHighBandwidthTopics = !enableHighBandwidthTopics;
        // Resubscribe accordingly
    }
}
```

## Building Standalone Applications

### Export Configuration

1. **Build Settings**: File → Build Settings
2. **Select Target Platform**: Windows, Linux, or macOS
3. **Player Settings**: Configure for your deployment environment
4. **ROS 2 Runtime**: Ensure ROS 2 environment variables are set

### Deployment Checklist

```csharp
public class DeploymentValidator : MonoBehaviour
{
    public bool ValidateEnvironment()
    {
        bool rosInstalled = System.Environment.GetEnvironmentVariable("ROS_DISTRO") != null;
        bool meshesFound = Directory.Exists(Application.persistentDataPath + "/meshes");

        Debug.Log($"ROS 2 Installed: {rosInstalled}");
        Debug.Log($"Meshes Available: {meshesFound}");

        return rosInstalled && meshesFound;
    }
}
```

## Key Takeaways

- Unity provides superior graphics and UI capabilities for robotics visualization
- ROS 2 for Unity enables seamless communication between Gazebo and Unity
- Real-time visualization of sensor data enhances algorithm understanding and debugging
- Interactive dashboards provide operator interfaces for monitoring and control
- LOD systems and efficient subscriptions optimize performance for complex scenes
- Standalone applications enable deployment of visualization tools across teams

## Next Steps

1. [Continue with Module 3](../module-3/index.md) - Explore NVIDIA Isaac Sim
2. [Advanced Visualization](../module-3/perception.md) - Combine with perception algorithms
3. [Build Complete Systems](../module-4/index.md) - Integrate with VLA and AI systems

## Further Reading

- [ROS 2 for Unity Documentation](https://github.com/Unity-Technologies/ROS2-For-Unity)
- [Unity Robotics Hub](https://github.com/Unity-Technologies/Robotics-Hub)
- [ROS 2 on Windows Setup](https://docs.microsoft.com/en-us/windows/dev-environment/ros/setup-on-windows)
- [Advanced Unity Graphics](https://docs.unity3d.com/Manual/Graphics.html)
