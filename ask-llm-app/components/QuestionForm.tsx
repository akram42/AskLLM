import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useAppContext } from "../contexts/AppContext";
import { getSources, getAnswer } from "../services/apiService";

const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isIndexed } = useAppContext();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(event.target.value);
  };

  // Modify the handleGetAnswer function to handle streaming
  const handleGetAnswer = async () => {
    if (question.trim()) {
      setIsLoading(true);
      setContext("");
      setAnswer("");

      try {
        const sources = await getSources(question);
        setContext(sources.join(`\n${"*".repeat(40)}\n`));
        await getAnswer((chunk: string) => {
          setAnswer((prevAnswer) => prevAnswer + chunk);
        });
      } catch (error) {
        console.error("Error fetching answer:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Question</FormLabel>
        <Textarea
          value={question}
          onChange={handleChange}
          isDisabled={!isIndexed}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={handleGetAnswer}
        mt={4}
        isLoading={isLoading}
        isDisabled={!isIndexed}
      >
        Get Answer
      </Button>
      <VStack align="start" mt={4}>
        <Text fontWeight="bold">Context:</Text>
        <Box
          height="15rem"
          width="100%"
          overflow="auto"
          p="4"
          borderColor="gray.300"
          borderWidth="1px"
          borderRadius="md"
        >
          <Text whiteSpace="pre-wrap">{context}</Text>
        </Box>
      </VStack>
      <VStack align="start" mt={4}>
        <Text fontWeight="bold">Answer:</Text>
        <Box
          height="10rem"
          width="100%"
          overflow="auto"
          p="4"
          borderColor="gray.300"
          borderWidth="1px"
          borderRadius="md"
        >
          <Text whiteSpace="pre-wrap">{answer}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default QuestionForm;
