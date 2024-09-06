import { BiAddToQueue } from 'react-icons/bi'
import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { BASE_URL } from '../App'

const CreateUserModal = ({setUsers}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name:"",
    role:"",
    description:"",
    gender: "male",
  });
  const toast = useToast();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(BASE_URL+"/friends",{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error)
      }
      toast({
        status: "success",
        title: "yayy!",
        description: "Friends created successfully.",
        duration: 2000,
        position: "top-center"
      });
      onClose();
      setUsers((prevUsers ) => [...prevUsers, data]);
      setInputs({
        name: "",
        role: "",
        description:"",
        gender: "male"
      });
    } catch (error) {
      toast({
        status: "error",
        title: "An error occured.",
        description: error.message,
        duration: 4000
      });
      
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <>
    <Button onClick={onOpen}>
      <BiAddToQueue size={20} />
    </Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleCreateUser}>
      <ModalContent>
        <ModalHeader>Add new Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}> 
          <Flex alignItems={"center"} gap={4}>
            {/* Left */}
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input value={inputs.name} 
              onChange={(e) => setInputs({...inputs, name: e.target.value})}/>
            </FormControl>
            {/* Right */}
            <FormControl>
              <FormLabel>Role</FormLabel>              
              <Input value={inputs.role} 
              onChange={(e) => setInputs({...inputs, role: e.target.value})}/>
            </FormControl>
          </Flex>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea resize={"none"} overflowY={"hidden"} 
              value={inputs.desription} 
              onChange={(e) => setInputs({...inputs, description: e.target.value})}/>
          </FormControl>
          <RadioGroup defaultValue='male' mt={4} >
            <Flex gap={5}>
              <Radio value='male'
                onChange={(e) => setInputs({...inputs, gender: e.target.value})}>Male</Radio>
              <Radio value='female'
                onChange={(e) => setInputs({...inputs, gender: e.target.value})}>Female</Radio>
            </Flex>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} type='submit'
            isLoading={isLoading}>
            Add
          </Button>
          <Button colorScheme='red' onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
      </form>
    </Modal>
  </>
  )
}

export default CreateUserModal
