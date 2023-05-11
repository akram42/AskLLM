import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { process } from "../services/apiService";

const IndexForm: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const { isFileUploaded, setIndexed } = useAppContext();
  const toast = useToast();

  const handleProcess = async () => {
    setProcessing(true); // Set processing state to true
    try {
      const response = await process();
      setIndexed(true);
      toast({
        title: "Document has been indexed",
        description: response.result,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error processing:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" marginBottom={4}>{`3. Index`}</Heading>
      <Text>Create an index to store document as embeddings.</Text>
      <Flex justifyContent="flex-end">
        <Button
          colorScheme="blue"
          onClick={handleProcess}
          isDisabled={!isFileUploaded || processing}
          isLoading={processing}
        >
          Index
        </Button>
      </Flex>
    </Box>
  );
};

export default IndexForm;
