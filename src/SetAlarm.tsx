import { Flex, Heading, Image, Input, SimpleGrid, Text } from "@chakra-ui/react";

import React from "react";

interface SetAlarmProps {
  task: string;
  setTask: (task: string) => void;
  alarmTime: string;
  setAlarmTime: (time: string) => void;
  result: boolean;
}

const SetAlarm: React.FC<SetAlarmProps> = ({ task, setTask, alarmTime, setAlarmTime, result }) => {
  const friendsData = [
    { name: "Sarah", time: "10:23pm", message: "Hurry up Xavier we got a movie to go to at 12!" },
    { name: "Amy", time: "10:54pm", message: "We're waiting for you to do your BeFit!!!" },
    { name: "William", time: "11:12pm", message: "LOL dude stop being lazy" },
    // Add more friends as needed
  ];
  
  const friendImages = [
    "https://cdn.discordapp.com/attachments/1206372275050520617/1213361507040104479/IMG_4022.mov?ex=65f531f6&is=65e2bcf6&hm=307d65eefb06d3faf3537d4033d3f8773108f2daaf9bb695dcc5391ceaf76b81&",
    "https://cdn.discordapp.com/attachments/1206372275050520617/1213392280325726249/ca603f04394d4af0b85fdc77819b7d9b.mov?ex=65f54e9f&is=65e2d99f&hm=6387b84da53d05f9d5e2b382b9403c71a9445652dacb06a1ab62fe2bcf7c8ab8&",
    "https://cdn.discordapp.com/attachments/1206372275050520617/1213361507866517514/IMG_4023.mov?ex=65f531f6&is=65e2bcf6&hm=ed524d09f1df49c2cca296706e2a3a2e5d1900a4cc9d691d443f2a76dfcdb020&",
    // Add more image URLs as needed
  ];
  return (
    <Flex flexDirection="column" alignItems="center">
      <Text fontSize="xl" color="white">Make doing pushups fun again!</Text>
      <br />

      {/* <Heading fontSize="2xl" color="white" mt="10px">
        In the morning, I will:
      </Heading>
      <Input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Morning Task" color="white" mt="10px" mb="10px" />

      <Heading fontSize="2xl" color="white" mt="10px">
        Alarm Time
      </Heading>
      <Input value={alarmTime} onChange={(e) => setAlarmTime(e.target.value)} placeholder="Alarm Time" color="white" mt="10px" mb="10px" />
      <Text>{result}</Text> */}
      <SimpleGrid columns={1} spacing={4} mt="10px">
  <Text fontSize="2xl" color="white">7 of your friends have already done their BeFits!</Text>
  <Text fontSize="3xl" color="white">{!result ? "Take a photo to see your friends doing pushups!" : "Here are your friends doing pushups!"}</Text>

  {friendsData.map((friend, index) => (
    <React.Fragment key={index}>
      <Text fontSize="xl" color="white">{`${friend.name} did their BeFit at ${friend.time}`}</Text>
      <Text fontSize="s" color="white">{`${friend.name}: ${friend.message}`}</Text>
      {result ? <video src={friendImages[index] } controls /> : <Image src="https://img.freepik.com/free-vector/clear-blurred-background_1034-587.jpg"></Image>}
    </React.Fragment>
  ))}

  {/* Add more friends and images as needed */}
</SimpleGrid>

    </Flex>
  );
};

export default SetAlarm;
