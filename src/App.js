import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [simpleSentence, setSimpleSentence] = useState("");
  const [complexSentence, setComplexSentence] = useState("");
  const toast = useToast();
  useEffect(() => {
    if (complexSentence) {
      const element = document.getElementById("result");
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [complexSentence]);
  const doNoting = (e) => {
    e.preventDefault();
  };
  const complexify = (e) => {
    e.preventDefault();
    if (!simpleSentence) {
      toast({
        title: "No sentence added",
        description: "Please fill the input field",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `I'll give you a sentence, 
        please rephrase it using complex english
         that is very very barely understandable. Make it lengthy.
          The sentence is ${simpleSentence}"
      `,
        temperature: 1,
        max_tokens: 250,
      })
      .then((res) => {
        return res;
      })
      .then((data) => {
        setComplexSentence(data.data.choices[0].text);
        // console.log(data.data.choices[0].text);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "An error occurred",
          description: "Try again",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const copy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(complexSentence);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div className="home">
      <p className="title"> Complexify</p>
      <div className="grid">
        <div className="examples">
          <p className="example-title">
            Do you want to convert a simple sentence into one which is complex
            and difficult to understand😂😂
          </p>
          <p className="transformer">Complexify transformed</p>
          <p className="simple-example">How are you?</p>
          <p className="to"> To</p>
          <p className="complex-example">
            I would incline to inquire after your present emotional and physical
            well-being, in order to ascertain your level of comfort and ease.
          </p>
        </div>
        <div className="vertical"></div>
        <div className="form-and-results">
          <textarea
            placeholder="Enter your simple sentence here"
            onChange={(e) => {
              setComplexSentence("");
              setSimpleSentence(e.target.value);
            }}
          />
          <a href="" onClick={isLoading ? doNoting : complexify}>
            {isLoading ? <Spinner size="md" /> : "Make it complex"}
          </a>
          {complexSentence && (
            <div className="complex" id="result">
              <p>{complexSentence}</p>
              <a href="" onClick={copy}>
                <FaCopy size={25} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
