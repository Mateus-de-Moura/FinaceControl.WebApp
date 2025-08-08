import Form from "./Form/index";
import { useParams } from 'react-router';

function Update() {
     const { id } = useParams<{ id: string }>();
  return (
    <Form Id={id} />
  )
}

export default Update