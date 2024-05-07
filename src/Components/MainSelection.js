import styles from "./MainSelection.module.css"
import Form from 'react-bootstrap/Form'

function MainSelection( {handleCourseChange, handleClassChange, handleActivityChange, courses, classes, activities} ) {
    return (
        <div className={styles.container}> 
            <h4>Selecione as informações:</h4>
            <Form.Select onChange={handleCourseChange} aria-label="Course">
                <option>Selecione um curso</option>
                {
                    courses.map( (course) => (
                        <option value={course.id}>{course.name}</option>
                    )) 
                }
            </Form.Select>

            <Form.Select onChange={handleClassChange} aria-label="Class">
                <option>Selecione uma turma</option>
                {
                    classes.map( (classElem) => (
                        <option value={classElem.id}>{classElem.name} ({classElem.class})</option>
                    ))
                }
            </Form.Select>

            <Form.Select onChange={handleActivityChange} aria-label="Class">
                <option>Selecione uma atividade</option>
                {
                    activities.map( (act) => (
                        <option  value={act.id}>{act.title}</option>
                    ))
                }
            </Form.Select>
        </div>
    )
}

export default MainSelection
