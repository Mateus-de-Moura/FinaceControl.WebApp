import { useParams } from 'react-router';
import Form from './Form/index'

function Update() {
    const { id } = useParams<{ id: string }>();
    return (
        <Form Id={id} />
    )
}

export default Update