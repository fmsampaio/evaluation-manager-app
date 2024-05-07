import styles from './EvaluationForm.module.css'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'

function EvaluationForm( { handleCommentsChange, handleSalvarClick, handleGradeInputChange, selectedActivity, comments } ) {
    return (
        <>
                        
            {
                selectedActivity.criteria.map( (crit) => (
                    <>
                        <Form.Label>{crit.short_name} - {crit.weight}:</Form.Label><Form.Control id={crit.short_name} onChange={handleGradeInputChange} size="sm" type="number" />    
                    </>  
                ))                            
            }
            <Form.Label>Comentários:</Form.Label>
            <Form.Control onChange={handleCommentsChange} value={comments} as="textarea" rows={3} />
            <Button onClick={handleSalvarClick} variant="success">Salvar</Button>
        </>
    )
}

export default EvaluationForm