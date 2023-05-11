import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  VStack,
  StackDirection,
  useBreakpointValue,
  Stack,
} from "@chakra-ui/react";
import ModelForm from "@/components/ModelForm";
import UploadForm from "@/components/UploadForm";
import IndexForm from "@/components/IndexForm";
import QuestionForm from "@/components/QuestionForm";

export default function Home() {
  const gradientBackground =
    "\
    radial-gradient(circle at 22% 11%,rgba(62, 180, 137,.20),transparent 19%), \
    radial-gradient(circle at 82% 25%,rgba(33,150,243,.18),transparent 35%),\
    radial-gradient(circle at 25% 61%,rgba(250, 128, 114, .28),transparent 55%)";

  const flexDirection = useBreakpointValue<StackDirection>({
    base: "column",
    md: "row",
  });
  const leftWidth = useBreakpointValue({ base: "100%", md: "40%" });
  const rightWidth = useBreakpointValue({ base: "100%", md: "60%" });
  const dividerOrientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "horizontal",
    md: "vertical",
  });

  return (
    <Center
      width="100%"
      minHeight="100vh"
      padding="4"
      bg={gradientBackground}
      backgroundAttachment="fixed"
      overflowY="auto"
    >
      <VStack
        w="90%"
        maxWidth="900px"
        spacing={8}
        bg="white"
        padding="2em"
        shadow="lg"
        borderRadius="lg"
      >
        <Heading sx={{ fontSize: "1.5em" }}>{`AskLLM`}</Heading>
        <Divider />
        <Stack spacing={8} direction={flexDirection} w="100%">
          <Stack w={leftWidth} spacing={4}>
            <ModelForm />
            <Divider />
            <UploadForm />
            <Divider />
            <IndexForm />
          </Stack>
          <Divider orientation={dividerOrientation} />
          <Box width={rightWidth}>
            <QuestionForm />
          </Box>
        </Stack>
      </VStack>
    </Center>
  );
}
