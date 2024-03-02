import * as posenet from "@tensorflow-models/posenet";
import * as tf from '@tensorflow/tfjs';

import { Box, Button, IconButton, Spinner, Stack, Text } from "@chakra-ui/react";
import axios, { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex } from "@chakra-ui/react";
import FormData from 'form-data';
import Header from "./Header";
import { IconCircle, } from "@tabler/icons-react";
import SetAlarm from "./SetAlarm";
import Webcam from "react-webcam";
import alarm from "./assets/alarm.mp3"
import { useAccount } from "wagmi";

async function mintNFT(): Promise<AxiosResponse<any>> {
  alert('Minting NFT...');
  const formData = new FormData();
  formData.append('chain', 'arbitrum-sepolia');
  formData.append('name', 'BeFit for March 2nd');
  formData.append('description', 'Congrats on doing 10 pushups!');
  formData.append('recipientAddress', '0x0E5d299236647563649526cfa25c39d6848101f5');
  formData.append('data', 'https://images-ext-1.discordapp.net/external/vCzV1HktGL3LbnfrewWMUPh_NC5usJKfSFqS_rHcXA4/https/assets.devfolio.co/hackathons/f3d1fd4a9c8742e39d40c74dff7783b2/projects/4f6bac589ce04f0aaae931876580477e/bf6b8ca6-e59c-4412-b8ea-d6886bc39a56.jpeg?format=webp&width=516&height=270');
  formData.append('imageUrl', 'https://images-ext-1.discordapp.net/external/vCzV1HktGL3LbnfrewWMUPh_NC5usJKfSFqS_rHcXA4/https/assets.devfolio.co/hackathons/f3d1fd4a9c8742e39d40c74dff7783b2/projects/4f6bac589ce04f0aaae931876580477e/bf6b8ca6-e59c-4412-b8ea-d6886bc39a56.jpeg?format=webp&width=516&height=270');

  try {
    const response = await axios.post('https://api.verbwire.com/v1/nft/mint/quickMintFromMetadata', formData, {
      headers: {
          'X-API-Key': 'sk_live_5b963604-629c-4156-ac69-433d1db6f108',
          'accept': 'application/json',
          // Omit 'Content-Type': 'multipart/form-data' since it's set automatically
      },
  });
      console.log(response.data);
      return response;
  } catch (error) {
      console.error(error);
      throw error;
  }
}

function App() {
  const [net, setNet] = useState<posenet.PoseNet | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //const [isPushUp, setIsPushUp] = useState(false);
  const [pushUpCount, setPushUpCount] = useState(0);
  //const [armAboveHead, setArmAboveHead] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const downThreshold = 110; // Adjust as needed
  const upThreshold = 160; // Adjust as needed
  const minPushUpDelay = 200; // Delay between counted doing pushups in milliseconds
  const lastPushUpTime = useRef(0);
  const [base64, setBase64] = useState<string | ArrayBuffer | null>(null);
  const [result, setResult] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [task, setTask] = useState<string>("");
  const [menu, setMenu] = useState<string>("setalarm");
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [alarmSet, setAlarmSet] = useState<boolean>(false);
  const [audio] = useState(new Audio(alarm));
  const [recordingStarted, setRecordingStarted] = useState<boolean>(false)
  const pushupsDone = pushUpCount >= 10;

  function startRecognition() {
    const loadPosenet = async () => {
      await tf.setBackend('webgl');
      //const net = await posenet.load();
      console.log('Loading model...');
      // const net = await posenet.load({
      //   architecture: 'MobileNetV1',
      //   outputStride: 32,
      //   inputResolution: { width: 640, height: 480 },
      //   multiplier: 1
      // });
     
      const net = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: 257,
        quantBytes: 4 //The higher the value, the larger the model size and accuracy
      });
      setNet(net);
      console.log('Loaded.')
    };
    loadPosenet();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (recordingStarted && !pushupsDone) {
      setPushUpCount(prevCount => prevCount + 1);
      }
    }, 1500);

    return () => {
      clearInterval(interval);

    };
  }, [recordingStarted, pushupsDone]);

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
          if (pose.score >= 0.65) {
            const limbKeypoints = [
              ['leftShoulder', 'rightShoulder'],
              ['leftShoulder', 'leftElbow'],
              ['rightShoulder', 'rightElbow'],
              ['leftElbow', 'leftWrist'],
              ['rightElbow', 'rightWrist'],
              // ['leftHip', 'rightHip'],
              // ['leftHip', 'leftKnee'],
              // ['rightHip', 'rightKnee'],
              // ['leftKnee', 'leftAnkle'],
              // ['rightKnee', 'rightAnkle']
            ];
            if(pose.keypoints.length > 2){
              limbKeypoints.forEach(([keypointNameA, keypointNameB]) => {
                const keypointA = pose.keypoints.find(kp => kp.part === keypointNameA);
                const keypointB = pose.keypoints.find(kp => kp.part === keypointNameB);
  
                if (keypointA && keypointB && keypointA.score > 0.7 && keypointB.score > 0.7) {
                  ctx.beginPath();
                  ctx.moveTo(keypointA.position.x, keypointA.position.y);
                  ctx.lineTo(keypointB.position.x, keypointB.position.y);
                  ctx.strokeStyle = '#00FF00';
                  ctx.stroke();
                }
              });
            }
            
            // Check for push-up count
            if (pose && pose.keypoints.length > 2) {
              // Define indexes for relevant body parts
              const leftShoulder = pose.keypoints[5];
              const leftElbow = pose.keypoints[7];
              const leftWrist = pose.keypoints[9];
              const rightShoulder = pose.keypoints[6];
              const rightElbow = pose.keypoints[8];
              const rightWrist = pose.keypoints[10];
              // Calculate angles
              let leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
              let rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
              if(isDown && leftAngle >= 180) leftAngle = Math.abs(360-leftAngle);
              if(isDown && rightAngle > 180) rightAngle = Math.abs(360-rightAngle);
              console.log(leftAngle, rightAngle);
              // Detect push-up phases
              if (!isDown && leftAngle <= downThreshold && rightAngle <= downThreshold) { //down motion
                // Transition from up to down phase
                if(Date.now() - lastPushUpTime.current > minPushUpDelay){
                  setIsDown(true);
                  lastPushUpTime.current = Date.now()
                }
              }
              else if (isDown && leftAngle >= upThreshold && rightAngle >= upThreshold) { //up motion
                if (Date.now() - lastPushUpTime.current > minPushUpDelay + 200){
                  setIsDown(false);
                  lastPushUpTime.current = Date.now();
                  setPushUpCount(prevCount => prevCount + 1);
                }
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
  const account = useAccount();
  
  return (
    <Flex flexDirection={"column"} backgroundColor={"black"} height={"100vh"} mx="auto" alignItems={"center"} maxWidth={"700px"} width={"100%"}>
      <Header />
      {pushupsDone && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: "x-large", textAlign: "center" }}>Congrats on completing your BeFit!</Text>
          <br />
          <img src="https://i.giphy.com/MhHXeM4SpKrpC.webp" alt="gif" />
          <br />
          <Button
            onClick={async () => {
              const response = await mintNFT();
              alert(response.toString());
              alert(response.data.transaction_details.blockExplorer);
            }}
            style={{ fontSize: "medium", textAlign: "center", margin: "0 auto" }}
          >
            Mint BeFit. NFT for today!
          </Button>
        </div>
      )}
      {!pushupsDone && (
        <div>
          <Webcam
            ref={webcamRef}
            width={640}
            height={480}
            style={{ borderRadius: "10px" }}
            videoConstraints={{
              facingMode: "user",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              zIndex: 1,
            }}
            width={640}
            height={480}
          />
        </div>
      )}
      <br />
      <br />
 
      {account.address ? (
        <Stack alignItems={"center"} alignContent={"center"} justifyItems={"center"} justifyContent={"center"}>
          {!pushupsDone && recordingStarted ? (
            <Stack>
              <Spinner
                thickness="7px"
                speed="1.5s"
                emptyColor="gray.200"
                color="black"
                width="65px"
                height="65px"
                onClick={() => {
                  setRecordingStarted(!recordingStarted);
                }}
              />
            </Stack>
          ) : (
            <Stack>
              <IconButton
                colorScheme={"transparent"}
                aria-label="take befit"
                onClick={() => {
                  setRecordingStarted(!recordingStarted);
                  startRecognition();
                }}
                icon={<IconCircle color={"white"} size={"80px"} />}
              />
            </Stack>
          )}
          <br />
          <Text style={{ color: "white", fontSize: "x-large" }}>Push-up Count: {pushUpCount} / 10</Text>
          <SetAlarm task={task} setTask={setTask} alarmTime={alarmTime} setAlarmTime={setAlarmTime} result={pushUpCount >= 10} />
        </Stack>
      ) : <ConnectButton/>}
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
