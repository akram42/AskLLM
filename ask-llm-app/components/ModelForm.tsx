import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Box,
  Button,
  FormControl,
  Input,
  Flex,
  Text,
  useToast,
  Heading,
  Select,
} from "@chakra-ui/react";
import { selectModel } from "../services/apiService";

const ModelForm: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [acceptedApiKey, setAcceptedApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model, setModel] = useState<string>("");
  const { isModelSelected, setModelSelected, setFileUploaded, setIndexed } =
    useAppContext();
  const toast = useToast();

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await selectModel({
        api_key: apiKey,
        model_name: model,
      });
      setModelSelected(true);
      setAcceptedApiKey(apiKey);
      setApiKey("");
      setModel("");
      toast({
        title: "API Key Accepted",
        description: response.result,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFileUploaded(false);
      setIndexed(false);
    } catch (error) {
      const typedError = error as Error;
      setModelSelected(false);
      toast({
        title: "API Key Rejected",
        description: typedError.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" marginBottom={4}>{`1. Model`}</Heading>
      <FormControl id="api-key" mb={4}>
        <Select
          placeholder="Select model"
          value={model}
          onChange={handleModelChange}
          mb={4}
        >
          <option value="llamaindex">llamaindex</option>
          <option value="langchain">langchain</option>
        </Select>
        <Input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="OpenAI key"
        />
      </FormControl>
      <Flex justifyContent="flex-end">
        {isModelSelected && acceptedApiKey && (
          <Text mr={4}>
            Key selected: {acceptedApiKey.slice(0, 10)}
            {"..."}
          </Text>
        )}
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!model || !apiKey}
          isLoading={isLoading}
        >
          Add API Key
        </Button>
      </Flex>
    </Box>
  );
};

export default ModelForm;
