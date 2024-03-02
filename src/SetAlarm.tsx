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
    { name: "Sarah", time: "7:23am", message: "Wake up Xavier! We got a movie to go to at 8am!" },
    { name: "Amy", time: "7:54am", message: "Wake up sleepyhead, we're waiting for you at school." },
    { name: "William", time: "8:12am", message: "LOL dude stop sleeping in" },
    // Add more friends as needed
  ];
  
  const friendImages = [
    "https://www.pedestrian.tv/wp-content/uploads/2022/08/15/Image-from-iOS-5-e1660543786465.jpg?quality=75",
    "https://josiegirlblog.com/wp-content/uploads/2022/08/Screen-Shot-2022-08-15-at-11.48.49-AM-614x1024.jpg",
    "https://www.boredpanda.com/blog/wp-content/uploads/2022/10/39-635fd45a12ad3__700.jpg",
    // Add more image URLs as needed
  ];
  return (
    <Flex flexDirection="column" alignItems="center">
      <Text fontSize="xl" color="white">Make doing pushups fun everyday!</Text>
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
      <Text fontSize="xl" color="white">{`${friend.name} did her BeFit at ${friend.time}`}</Text>
      <Text fontSize="s" color="white">{`${friend.name}: ${friend.message}`}</Text>
      <Image src={result ? friendImages[index] : "https://img.freepik.com/free-vector/clear-blurred-background_1034-587.jpg" } alt={`Image ${index + 1}`} objectFit="cover" borderRadius="md" />
    </React.Fragment>
  ))}

  {/* Add more friends and images as needed */}
</SimpleGrid>

    </Flex>
  );
};

export default SetAlarm;
