import * as posenet from "@tensorflow-models/posenet";
import * as tf from '@tensorflow/tfjs';

import { Button, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import SetAlarm from "./SetAlarm";
import Webcam from "react-webcam";
import alarm from "./assets/alarm.mp3"

function App() {
  const [net, setNet] = useState<posenet.PoseNet | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //const [isPushUp, setIsPushUp] = useState(false);
  const [pushUpCount, setPushUpCount] = useState(0);
  //const [armAboveHead, setArmAboveHead] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const downThreshold = 100; // Adjust as needed
  const upThreshold = 160; // Adjust as needed
  const minPushUpDelay = 500; // Delay between counted doing pushups in milliseconds
  const lastPushUpTime = useRef(0);
  const [base64, setBase64] = useState<string | ArrayBuffer | null>(null);
  const [result, setResult] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [task, setTask] = useState<string>("");
  const [menu, setMenu] = useState<string>("setalarm");
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [alarmSet, setAlarmSet] = useState<boolean>(false);
  const [audio] = useState(new Audio(alarm));

  function startRecognition() {
    const loadPosenet = async () => {
      await tf.setBackend('webgl');
      const net = await posenet.load();
      setNet(net);
    };
    loadPosenet();
  };

  useEffect(() => {
    const drawSkeleton = async () => {
      if (net && webcamRef.current && canvasRef.current) {
        const video = webcamRef.current.video as HTMLVideoElement;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        async function poseDetectionFrame() {
          // Ensure net is not null
          if (!net) return;

          // Estimate a single pose
          const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
          });

          if(!ctx) return;
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the pose skeleton
          if (pose.score >= 0.25) {
            const limbKeypoints = [
              ['leftShoulder', 'rightShoulder'],
              ['leftShoulder', 'leftElbow'],
              ['rightShoulder', 'rightElbow'],
              ['leftElbow', 'leftWrist'],
              ['rightElbow', 'rightWrist'],
              ['leftHip', 'rightHip'],
              ['leftHip', 'leftKnee'],
              ['rightHip', 'rightKnee'],
              ['leftKnee', 'leftAnkle'],
              ['rightKnee', 'rightAnkle']
            ];

            limbKeypoints.forEach(([keypointNameA, keypointNameB]) => {
              const keypointA = pose.keypoints.find(kp => kp.part === keypointNameA);
              const keypointB = pose.keypoints.find(kp => kp.part === keypointNameB);

              if (keypointA && keypointB && keypointA.score > 0.1 && keypointB.score > 0.1) {
                ctx.beginPath();
                ctx.moveTo(keypointA.position.x, keypointA.position.y);
                ctx.lineTo(keypointB.position.x, keypointB.position.y);
                ctx.strokeStyle = '#00FF00';
                ctx.stroke();
              }
            });
            // Check for push-up count
            if (pose && pose.keypoints.length > 0) {
              console.log(lastPushUpTime);
              // Define indexes for relevant body parts
              const leftShoulder = pose.keypoints[5];
              const leftElbow = pose.keypoints[7];
              const leftWrist = pose.keypoints[9];
              const rightShoulder = pose.keypoints[6];
              const rightElbow = pose.keypoints[8];
              const rightWrist = pose.keypoints[10];

              // Calculate angles
              const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
              const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
              // Detect push-up phases
              if (!isDown && leftAngle < downThreshold && rightAngle < downThreshold) {
                // Transition from up to down phase
                setIsDown(true);
              } else if (Date.now() - lastPushUpTime.current > minPushUpDelay
                        && isDown && leftAngle > upThreshold && rightAngle > upThreshold) {
                // Transition from down to up phase
                setIsDown(false);
                // Increment push-up count
                if (Date.now() > lastPushUpTime.current) lastPushUpTime.current = Date.now();
                //console.log(lastPushUpTime)
                setPushUpCount(prevCount => prevCount + 1);
              }
            }
          }

          // Repeat the process for continuous detection
          requestAnimationFrame(poseDetectionFrame);
        }

        poseDetectionFrame();
      }
    };

    drawSkeleton();
  }, [net, isDown]);

  // Function to calculate the angle given three keypoints
  const calculateAngle = (pointA: posenet.Keypoint, pointB: posenet.Keypoint, pointC: posenet.Keypoint) => {
    const angleRadians = Math.atan2(pointC.position.y - pointB.position.y, pointC.position.x - pointB.position.x) -
                         Math.atan2(pointA.position.y - pointB.position.y, pointA.position.x - pointB.position.x);
    let angleDegrees = angleRadians * 180 / Math.PI;
    angleDegrees = Math.abs(angleDegrees);
    return angleDegrees;
};

  return (
    <Flex
      flexDirection={"column"}
      backgroundColor={"black"}
      height={"100vh"}
      mx="auto"
      alignItems={"center"}
      maxWidth={"700px"}
      width={"100%"}
    >
      <Webcam
        ref={webcamRef}
        width={640}
        height={480}
        videoConstraints={{
          facingMode: "user"
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          zIndex: 1
        }}
        width={640}
        height={480}
      />
      <br />
      <Button onClick={() => startRecognition()}>Start!</Button>
      <br />

      <Text style={{ color: "white" }}>Push-up Count: {pushUpCount} / 10</Text>
        <SetAlarm
        task={task}
        setTask={setTask}
        alarmTime={alarmTime}
        setAlarmTime={setAlarmTime}
        result={pushUpCount >= 10}
      />
    </Flex>
  );
}

// return (
//   <Flex
//     flexDirection={"column"}
//     backgroundColor={"black"}
//     height={"100vh"}
//     mx="auto"
//     alignItems={"center"}
//     maxWidth={"700px"}
//     width={"100%"}
//     borderX={"1px solid gray "}
//   >
//     <Header />
//     {menu === "takeBeFit" && (
//       <TakeBeFit
//         base64={base64}
//         setBase64={setBase64}
//         result={result}
//         setResult={setResult}
//         capturedImage={capturedImage}
//         setCapturedImage={setCapturedImage}
//         task={task}
//         setTask={setTask}
//       />
//     )}
//     {menu === "setalarm" && (
//       <SetAlarm
//         task={task}
//         setTask={setTask}
//         alarmTime={alarmTime}
//         setAlarmTime={setAlarmTime}
//         result={result}
//       />
//     )}
//   </Flex>
// );
// }

export default App;
