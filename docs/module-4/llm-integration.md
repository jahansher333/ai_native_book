---
title: "LLM Integration"
description: "Integrate large language models for robot reasoning, planning, and decision-making"
module_id: "module-4"
sidebar_position: 2
tags: ["llm", "reasoning", "planning", "language-models", "prompt-engineering"]
difficulty: advanced
estimated_minutes: 30
---

# LLM Integration

## Learning Objectives

By the end of this section, you will be able to:
- Understand LLM capabilities for robotics reasoning
- Implement task decomposition using LLMs
- Design effective robot-specific prompts
- Integrate LLMs into ROS 2 systems
- Handle LLM outputs and error recovery
- Optimize LLM inference for real-time systems
- Build hierarchical planning systems

## Introduction to LLM-Based Robotics

Large Language Models (LLMs) have emerged as powerful tools for robot reasoning. They can understand natural language instructions, break down complex tasks into subtasks, and generate interpretable plans. This section explores how to effectively integrate LLMs into robotics systems.

### Why LLMs for Robotics?

- **Task Understanding**: Parse complex, ambiguous instructions
- **Common Sense Reasoning**: Apply knowledge about the physical world
- **Flexible Planning**: Generate novel solutions to new problems
- **Explainability**: Provide reasoning traces for human understanding
- **Transfer Learning**: Leverage pre-trained knowledge for new domains

## LLM APIs for Robotics

### Using OpenAI GPT

```python
import openai

class RobotTaskPlanner:
    def __init__(self, api_key):
        openai.api_key = api_key
        self.model = "gpt-4"
        self.temperature = 0.7

    def plan_task(self, instruction, context=""):
        """
        Use LLM to decompose task into subtasks

        Args:
            instruction: Natural language task description
            context: Additional context about robot capabilities
        """
        system_prompt = """You are a robotics task planning system.
Your job is to break down complex tasks into executable subtasks.
Respond with a JSON object containing:
{
    "subtasks": [
        {"task": "description", "priority": "high/medium/low"},
        ...
    ],
    "estimated_duration": "seconds",
    "requires_human_supervision": true/false,
    "reasoning": "explanation"
}
"""

        user_prompt = f"""
Robot capabilities:
{context}

Task: {instruction}

Please break this down into subtasks.
"""

        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=self.temperature
        )

        return response.choices[0].message['content']

    def generate_manipulation_plan(self, task_description):
        """Generate grasp and manipulation plan"""
        prompt = f"""
Given the task: {task_description}

Generate a detailed plan for manipulation including:
1. Object to grasp
2. Grasp type (precision, power, etc.)
3. Trajectory to execute
4. Success criteria

Format as structured JSON.
"""
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2  # Lower temp for structured output
        )

        return response.choices[0].message['content']
```

### Using Local LLMs (Hugging Face)

```python
from transformers import pipeline

class LocalRobotPlanner:
    def __init__(self, model_name="meta-llama/Llama-2-7b"):
        """Initialize local LLM"""
        self.pipeline = pipeline(
            "text-generation",
            model=model_name,
            device=0  # GPU 0
        )

    def plan_task(self, instruction):
        """Local LLM task planning"""
        prompt = f"""Robot Task Planning:

Instruction: {instruction}

Subtasks:
1."""

        result = self.pipeline(
            prompt,
            max_length=512,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )

        return result[0]['generated_text']

    def ground_in_environment(self, instruction, env_context):
        """Ground language in specific environment"""
        prompt = f"""
Environment: {env_context}
Instruction: {instruction}

How should the robot accomplish this task in this specific environment?
"""
        # Implementation
        pass
```

## Prompt Engineering for Robotics

### Effective Robot Prompts

```python
class RobotPromptTemplate:
    """Template for robot-specific prompts"""

    @staticmethod
    def task_decomposition_prompt(instruction, robot_spec):
        """High-quality task decomposition prompt"""
        return f"""You are an expert robot task planner. Your goal is to decompose
natural language instructions into executable robot actions.

ROBOT SPECIFICATION:
{robot_spec}

INSTRUCTION:
{instruction}

Please decompose this instruction into:
1. **Perception Goals**: What the robot needs to perceive
2. **Navigation Plan**: How to navigate to required locations
3. **Manipulation Steps**: Object interactions required
4. **Success Criteria**: How to verify task completion
5. **Error Handling**: What to do if something fails

Format your response as structured JSON with clear action sequences."""

    @staticmethod
    def safety_constrained_prompt(instruction):
        """Prompt emphasizing safety"""
        return f"""SAFETY-CRITICAL TASK PLANNING

Instruction: {instruction}

SAFETY CONSTRAINTS:
1. Never collide with humans
2. Avoid dropping objects from height > 1m
3. Check gripper load before lifting
4. Verify path clearance before moving

Generate a safe execution plan that respects these constraints."""

    @staticmethod
    def multi_robot_coordination(instruction, num_robots):
        """Prompt for multi-robot tasks"""
        return f"""MULTI-ROBOT COORDINATION

Task: {instruction}
Number of robots: {num_robots}

Assign subtasks to robots such that:
1. Work is parallelized efficiently
2. Dependencies are respected
3. Communication overhead is minimized
4. All robots have clear objectives

Provide task assignment and synchronization points."""
```

## ROS 2 Integration with LLMs

### LLM Planning Node

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from custom_msgs.msg import Plan, Task
import json

class LLMPlannerNode(Node):
    def __init__(self):
        super().__init__('llm_planner')

        self.planner = RobotTaskPlanner(api_key="sk-...")
        self.current_plan = None

        # Subscribers
        self.create_subscription(
            String,
            '/user_instruction',
            self.instruction_callback,
            10
        )

        self.create_subscription(
            String,
            '/execution_feedback',
            self.feedback_callback,
            10
        )

        # Publishers
        self.plan_pub = self.create_publisher(
            Plan,
            '/generated_plan',
            10
        )

        self.status_pub = self.create_publisher(
            String,
            '/planning_status',
            10
        )

    def instruction_callback(self, msg):
        """Process user instruction"""
        instruction = msg.data
        self.get_logger().info(f'Received instruction: {instruction}')

        # Get context from environment
        context = self._gather_environment_context()

        # Plan using LLM
        plan_json = self.planner.plan_task(instruction, context)

        # Parse and publish
        try:
            plan_dict = json.loads(plan_json)
            plan_msg = self._create_plan_message(plan_dict)
            self.plan_pub.publish(plan_msg)
            self.current_plan = plan_dict

            status = String()
            status.data = f"Plan generated: {len(plan_dict['subtasks'])} subtasks"
            self.status_pub.publish(status)

        except json.JSONDecodeError as e:
            self.get_logger().error(f'Failed to parse LLM output: {e}')

    def feedback_callback(self, msg):
        """Handle execution feedback"""
        feedback = msg.data

        if "failed" in feedback.lower():
            self.get_logger().warn(f'Task failed: {feedback}')
            # Replan with failure context
            self._replan_with_context(feedback)

    def _gather_environment_context(self):
        """Gather current environment information"""
        context = """
Current Environment:
- Objects in scene: cube (red), sphere (blue), table
- Robot position: (0, 0, 0)
- Gripper status: empty
- Available actions: navigate, grasp, place, push
"""
        return context

    def _create_plan_message(self, plan_dict):
        """Convert LLM output to ROS Plan message"""
        plan_msg = Plan()
        plan_msg.header.stamp = self.get_clock().now().to_msg()

        for subtask in plan_dict['subtasks']:
            task_msg = Task()
            task_msg.description = subtask['task']
            task_msg.priority = subtask['priority']
            plan_msg.tasks.append(task_msg)

        return plan_msg

    def _replan_with_context(self, failure_context):
        """Replan given failure feedback"""
        pass
```

## Task Decomposition and Execution

### Hierarchical Planning

```python
class HierarchicalPlanner:
    """Multi-level planning hierarchy"""

    def __init__(self, llm_planner):
        self.llm_planner = llm_planner
        self.skill_library = self._load_skill_library()

    def hierarchical_plan(self, high_level_task):
        """
        Multi-level decomposition:
        Level 0: High-level instruction
        Level 1: Subgoals (LLM)
        Level 2: Skills (mapping to primitives)
        Level 3: Motor commands
        """
        # Level 1: LLM decomposition
        subgoals = self._decompose_with_llm(high_level_task)

        # Level 2: Map to skills
        skill_sequence = []
        for goal in subgoals:
            skills = self._find_matching_skills(goal)
            skill_sequence.extend(skills)

        # Level 3: Expand to motor commands
        commands = self._expand_to_commands(skill_sequence)

        return {
            'high_level_task': high_level_task,
            'subgoals': subgoals,
            'skills': skill_sequence,
            'commands': commands
        }

    def _decompose_with_llm(self, task):
        """Use LLM for high-level decomposition"""
        plan_json = self.llm_planner.plan_task(task)
        plan = json.loads(plan_json)
        return plan['subtasks']

    def _find_matching_skills(self, goal):
        """Find skills matching goal"""
        matching = []
        for skill_name, skill_def in self.skill_library.items():
            if skill_def['preconditions_met']() and \
               skill_def['can_achieve'](goal):
                matching.append(skill_name)

        return matching

    def _expand_to_commands(self, skills):
        """Expand skills to low-level commands"""
        commands = []
        for skill in skills:
            skill_def = self.skill_library[skill]
            skill_commands = skill_def['get_commands']()
            commands.extend(skill_commands)

        return commands

    def _load_skill_library(self):
        """Load pre-defined skills"""
        return {
            'grasp': {
                'preconditions_met': lambda: True,
                'can_achieve': lambda goal: 'grasp' in goal.lower(),
                'get_commands': lambda: [
                    {'action': 'move_to_object'},
                    {'action': 'open_gripper'},
                    {'action': 'grasp_object'}
                ]
            },
            'navigate': {
                'preconditions_met': lambda: True,
                'can_achieve': lambda goal: 'move' in goal.lower() or 'go' in goal.lower(),
                'get_commands': lambda: [
                    {'action': 'plan_path'},
                    {'action': 'follow_path'}
                ]
            },
            # More skills...
        }
```

## Error Handling and Recovery

### LLM-Based Error Recovery

```python
class ErrorRecoverySystem:
    def __init__(self, llm_planner):
        self.llm_planner = llm_planner
        self.error_history = []

    def handle_execution_error(self, error_description, current_state):
        """
        Handle errors using LLM reasoning

        Args:
            error_description: What went wrong
            current_state: Current robot state
        """
        recovery_prompt = f"""
ROBOT ERROR RECOVERY

Error: {error_description}
Current State: {current_state}

Previous successful recovery strategies: {self.error_history}

Generate a recovery plan that:
1. Brings robot to safe state
2. Diagnoses the issue
3. Attempts to recover or request human help
"""

        recovery_plan = self.llm_planner.plan_task(recovery_prompt)
        self.error_history.append(recovery_plan)

        return recovery_plan

    def learn_from_failure(self, error, solution):
        """Update error history for future reference"""
        self.error_history.append({
            'error': error,
            'solution': solution,
            'timestamp': time.time()
        })
```

## Performance Optimization

### Prompt Caching

```python
class PromptCache:
    """Cache LLM responses for similar queries"""

    def __init__(self):
        self.cache = {}

    def query_with_cache(self, instruction, llm_planner):
        """Query with caching"""
        cache_key = hash(instruction)

        if cache_key in self.cache:
            return self.cache[cache_key]

        result = llm_planner.plan_task(instruction)
        self.cache[cache_key] = result

        return result

    def clear_old_entries(self, max_age_hours=24):
        """Clear cache entries older than max_age"""
        current_time = time.time()
        to_delete = []

        for key, (value, timestamp) in self.cache.items():
            if (current_time - timestamp) > (max_age_hours * 3600):
                to_delete.append(key)

        for key in to_delete:
            del self.cache[key]
```

### Batch Processing

```python
class BatchLLMPlanner:
    """Process multiple planning requests efficiently"""

    def __init__(self, llm_planner, batch_size=5):
        self.llm_planner = llm_planner
        self.batch_size = batch_size
        self.queue = []

    def add_planning_request(self, instruction):
        """Queue planning request"""
        self.queue.append(instruction)

        if len(self.queue) >= self.batch_size:
            return self.process_batch()

        return None

    def process_batch(self):
        """Process all queued requests together"""
        if not self.queue:
            return []

        results = []
        for instruction in self.queue:
            plan = self.llm_planner.plan_task(instruction)
            results.append(plan)

        self.queue = []
        return results
```

## Key Takeaways

- LLMs enable flexible reasoning and task decomposition for robotics
- Well-designed prompts significantly improve task planning quality
- Multi-level hierarchy combines LLM reasoning with skill execution
- Error recovery using LLMs adds robustness to robotic systems
- Caching and batch processing optimize inference latency
- Integration with ROS 2 enables seamless system deployment

## Next Steps

1. [Implement Voice Commands](./voice-commands.md) - Add speech interface
2. [Build SLAM Systems](./slam.md) - Advanced localization
3. [Implement Manipulation](./manipulation.md) - Grasping and control

## Further Reading

- [LLMs for Robotics Survey](https://arxiv.org/abs/2307.15363)
- [Code as Policies](https://arxiv.org/abs/2209.07753)
- [PALM-E: Embodied Language Models](https://arxiv.org/abs/2303.03378)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/gpt-best-practices)
