# config_v3.py

# --- Camera and Display ---
CAMERA_SOURCE = "http://192.168.1.5:8080/video"  # IP camera URL
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# --- Pose Estimation ---
POSE_MODEL_COMPLEXITY = 1 # Use 1 for better landmark accuracy

# --- V3 Fall Detection Logic ---
# The % of the person's height that the hips must drop to trigger a potential fall.
# This is much more robust than a fixed velocity.
HEIGHT_DROP_THRESHOLD = 0.3  # 30% of body height

# The angle of the torso from vertical (in degrees) to be considered 'on the ground'.
TORSO_ANGLE_THRESHOLD = 55.0

# The aspect ratio (height/width) to be considered 'on the ground'.
ASPECT_RATIO_THRESHOLD = 0.8

# The minimum duration (in seconds) of inactivity + being on the ground to confirm a fall.
CONFIRMATION_TIME_THRESHOLD = 2.5

# Maximum movement distance (normalized) to be considered 'inactive'.
INACTIVITY_MOVEMENT_THRESHOLD = 0.02

# How many seconds to wait after a confirmed fall before resetting the state.
FALL_RESET_TIMEOUT = 5.0