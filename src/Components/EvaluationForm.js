import styles from './EvaluationForm.module.css'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'



function EvaluationForm( { handleCommentsChange, handleSalvarClick, handleGradeInputChange, selectedActivity, comments } ) {
    return (
        <div className={styles.container}>
            <h4>Avaliação:</h4>            
            {
                selectedActivity.criteria.map( (crit) => (
                    <div className={styles.crit_container}>
                        <Form.Label className={styles.crit_label}><strong>{crit.short_name} - {crit.weight}:</strong></Form.Label><Form.Control id={crit.short_name} onChange={handleGradeInputChange} defaultValue={'10'} size="sm" type="number" />    
                    </div>  
                ))                            
            }
            <Form.Label><strong>Comentários:</strong></Form.Label>
            <Form.Control onChange={handleCommentsChange} value={comments} as="textarea" rows={3} />
            <Button onClick={handleSalvarClick} variant="success">Salvar</Button>
        </div>
    )
}

export default EvaluationForm