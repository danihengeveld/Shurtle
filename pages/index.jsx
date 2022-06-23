import {
  Box,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Button,
  InputGroup,
  InputLeftAddon,
  useToast,
  useColorModeValue,
  Text,
  IconButton,
  Link,
  Icon,
} from "@chakra-ui/react";
import { FaLink, FaGithub } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import Head from "next/head";

export default function Home() {
  const toast = useToast();

  return (
    <div>
      <Head>
        <title>Shurtle</title>
      </Head>

      <Flex minH="100vh" align="center" justify="center">
        <VStack spacing="8" mx="auto" maxW="lg" py="12" px="6">
          <VStack align="center">
            <Heading fontSize="7xl">Shurtle</Heading>
            <HStack>
              <Text fontSize="lg">Open source URL shortener</Text>
              <FaLink />
            </HStack>
          </VStack>
          <Box
            rounded="xl"
            boxShadow={useColorModeValue("lg", "dark-lg")}
            p="8"
          >
            <Formik
              initialValues={{ url: "", slug: "" }}
              onSubmit={async (values, actions) => {
                await handleSubmit(values, actions, toast);
                actions.setSubmitting(false);
              }}
              validationSchema={yup.object({
                url: yup
                  .string()
                  .url("Must be a valid URL!")
                  .required("Cannot be empty!"),
                slug: yup
                  .string()
                  .matches(
                    /^[a-zA-Z0-9-]*$/,
                    "Only letters, numbers and hyphens are allowed!"
                  )
                  .required("Cannot be empty!"),
              })}
            >
              {(props) => (
                <Form>
                  <VStack spacing="4">
                    <Field name="url">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.url && form.touched.url}
                        >
                          <FormLabel htmlFor="url">Full URL</FormLabel>
                          <Input
                            {...field}
                            id="url"
                            type="url"
                            placeholder="https://youtube.com/"
                          />
                          <FormHelperText>
                            The full URL that you are trying to shorten.
                          </FormHelperText>
                          <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="slug">
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.slug && form.touched.slug}
                        >
                          <FormLabel htmlFor="slug">Shurtle Link</FormLabel>
                          <InputGroup>
                            <InputLeftAddon>shurtle.app/</InputLeftAddon>
                            <Input
                              {...field}
                              id="slug"
                              type="text"
                              placeholder="yt"
                            />
                          </InputGroup>
                          <FormHelperText>
                            The Shurtle URL to shorten to.
                          </FormHelperText>
                          <FormErrorMessage>
                            {form.errors.slug}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Button
                      alignSelf="end"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Shurtle it!
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Box>
          <HStack>
            <Text fontSize="lg">
              Created by{" "}
              <Link
                color="blue.500"
                href="https://github.com/danihengeveld/"
                target="_blank"
              >
                Dani Hengeveld
              </Link>
              !
            </Text>
            <Link
              href="https://github.com/danihengeveld/Shurtle"
              target="_blank"
            >
              <IconButton
                borderRadius="3xl"
                size="md"
                variant="ghost"
                icon={<FaGithub />}
              />
            </Link>
          </HStack>
        </VStack>
      </Flex>
    </div>
  );
}

async function handleSubmit(values, actions, toast) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  };

  const response = await fetch("/api/create-url", requestOptions);
  const json = await response.json();

  if (!response.ok) {
    toast({
      title: "Choose a different slug!",
      description: json.message,
      status: "error",
      duration: 10000,
      position: "bottom",
      variant: "top-accent",
      isClosable: true,
    });

    actions.setFieldValue("url", values.url);
    actions.setFieldValue("slug", "");

    return;
  }

  toast({
    title: "Shurtled!",
    description: `Reachable at: shurtle.app/${json.slug}`,
    status: "success",
    duration: 10000,
    position: "bottom",
    variant: "top-accent",
    isClosable: true,
  });

  actions.setFieldValue("url", "");
  actions.setFieldValue("slug", "");
  actions.setTouched({}, false);
}
