import React, { useCallback, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDropzone, Accept } from "react-dropzone";
import { uploadPdf } from "../services/apiService";

const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { isModelSelected, setFileUploaded } = useAppContext();
  const toast = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        acceptedFiles.length > 0 &&
        acceptedFiles[0].type === "application/pdf"
      ) {
        setFile(acceptedFiles[0]);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (file) {
      setUploading(true);
      try {
        const response = await uploadPdf(file);
        setFileUploaded(true);
        toast({
          title: "File Uploaded",
          description: response.result,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        const typedError = error as Error;
        toast({
          title: "File Upload Failed",
          description: typedError.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box>
      <Heading as="h1" size="md" marginBottom={4}>{`2. Upload PDF`}</Heading>
      <FormControl>
        <Box
          {...getRootProps()}
          border="2px"
          borderRadius="md"
          borderColor="gray.200"
          p={4}
          mb={4}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop the file here...</Text>
          ) : (
            <Text>
              Drag and drop a PDF file here, or click to select a file
            </Text>
          )}
        </Box>
      </FormControl>
      <Flex justifyContent="flex-end">
        {file && (
          <Text mb={4}>
            Selected file: <strong>{file.name.slice(0, 20)}</strong>
          </Text>
        )}
        <Button
          colorScheme="blue"
          onClick={handleUpload}
          isDisabled={!file || !isModelSelected || uploading}
          isLoading={uploading}
        >
          Upload PDF
        </Button>
      </Flex>
    </Box>
  );
};

export default UploadForm;
