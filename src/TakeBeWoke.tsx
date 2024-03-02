import "./App.css";

import { Box, Button, Divider, Flex, Heading, IconButton, Input } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { IconCircle } from "@tabler/icons-react";
import Webcam from "react-webcam";

import logoSquare from "./logo-square.png";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const chat = new ChatOpenAI({
  modelName: "gpt-4-vision-preview",
  maxTokens: 1024,
  openAIApiKey: OPENAI_API_KEY,
});

async function isBase64UrlImage(base64String: string) {
  let image = new Image();
  image.src = base64String;
  return await new Promise((resolve) => {
    image.onload = function () {
      if (image.height === 0 || image.width === 0) {
        resolve(false);
        return;
      }
      resolve(true);
    };
    image.onerror = () => {
      resolve(false);
    };
  });
}
type TakeBeFitProps = {
  base64: string | ArrayBuffer | null;
  setBase64: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  capturedImage: string | null;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
};
const TakeBeFit: React.FC<TakeBeFitProps> = ({ base64, setBase64, result, setResult, capturedImage, setCapturedImage, task, setTask }) => {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 480,
    height: 640,
    facingMode: facingMode,
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          const base64Image = canvas.toDataURL("image/jpeg");
          setBase64(base64Image);
        }
      };
    }
  }, [webcamRef]);

  useEffect(() => {
    async function runEffect() {
      if (base64) {
        if (await isBase64UrlImage(base64.toString())) {
          const message = new HumanMessage({
            content: [
              {
                type: "text",
                text: `The user said that they would '${task}' today. Does this image depict that, or include objects related to what they said they would do? Respond in a one word answer, yes or no. If you don't know, just say no. Example: 'brush teeth'. With this example, if image appears to be in a bathroom or has a toothbrush in it, you would say yes. Otherwise, no. Never answer anything other than yes or no.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64.toString().split(",")[1]}`,
                },
              },
            ],
          });
        console.log("making API Call")
          const res = await chat.invoke([message]);
          setResult(res.content.toString());
        } else {
          console.error("Not an image");
        }
      } else {
        console.error("No base64");
      }
    }

    runEffect();
  }, [base64]);

  useEffect(() => {
    if (!capturedImage) {
      setResult("");
    }
  }, [capturedImage]);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent={"center"} justifyItems={"center"}>
      {/* <Button onClick={() => setFacingMode((prevState) => (prevState === "user" ? "environment" : "user"))}>Switch Camera</Button> */}
      <br />
      <Heading color={"white"}>{result}</Heading>
      <Box mx="20px" overflow={"hidden"} borderRadius={"10px"} maxW={"350px"}>
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" width={"100%"} />
        ) : (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={"100%"} videoConstraints={videoConstraints} />
        )}
      </Box>

      <br />
      <br />
      <IconCircle color={"white"} onClick={capture} size={"90px"} />
    </Flex>
  );
};

export default TakeBeFit;
