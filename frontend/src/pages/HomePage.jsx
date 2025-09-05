/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import {
  Container,
  Box,
  Text,
  Tabs,
} from "@chakra-ui/react";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'))

    if(user) navigate('/chats')
  }, [])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      >
        <Text className='bold-fonts' fontSize="4xl" color="black">
          Just ChatUp!
        </Text>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="white"
        w="100%"
        p={4}
        pb={8}
        borderRadius="lg"
        color="black"
      >
        <Tabs.Root
          variant="enclosed"
          maxW="md"
          fitted
          defaultValue={"tab-1"}
          bg="white"
          className="w-full"
        >
          <Tabs.List bgColor="white" mb="1em">
            <Tabs.Trigger
              fontSize="lg"
              value="tab-1"
              css={{
                borderRadius: "full", // rounded corners
                px: "4",
                py: "2",
                fontWeight: "medium",
                _selected: {
                  bg: "blue.200", // background for active tab
                  color: "blue.700", // text color for active tab
                },
              }}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              fontSize="lg"
              value="tab-2"
              css={{
                borderRadius: "full", // rounded corners
                px: "4",
                py: "2",
                fontWeight: "medium",
                _selected: {
                  bg: "blue.200", // background for active tab
                  color: "blue.700", // text color for active tab
                },
              }}
            >
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="tab-1">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="tab-2">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;