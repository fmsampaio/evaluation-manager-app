import { useEffect, useState } from 'react'
import styles from './EvaluationExportPage.module.css'
import { Typeahead } from 'react-bootstrap-typeahead'
import ActivityDescription from '../Components/ActivityDescription'

function EvaluationExportPage() {

    const [students, setStudents] = useState([])
    const [activities, setActivities] = useState([])
    const [evaluations, setEvaluations] = useState([])
    const [isSelectedStudent, setIsSelectedStudent] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState({})

    const BASE_API_URL = 'http://localhost:5000/'

    useEffect( () => {
        list('students')
        list('activities')
        list('evaluations')
    }, [])

    function list(resource) {
        fetch(`${BASE_API_URL}${resource}/`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then( (resp) => resp.json() )
        .then( (data) => { 
            if(resource === 'students') {
                setStudents(data)
            }
            else if(resource === 'activities') {
                setActivities(data)
            }
            else if(resource === 'evaluations') {
                setEvaluations(data)
            }
        })
    }



    function handleStudentChange(e) {
        if(e.length === 0) {
            setSelectedStudent({})
            setIsSelectedStudent(false)
        }
        else {
            setSelectedStudent(e[0])
            setIsSelectedStudent(true)
        }
    }


    function generateEvaluationReport(evalId) {
        var evaluation = evaluations.filter( (ev) => ev.id === evalId )[0]
        var activity = activities.filter( (act) => act.id === evaluation.activity_id )[0]
        console.log(evaluation)
        console.log(activity)
        return (
            <div className={styles.report_container}>
                <ActivityDescription
                    selectedActivity={activity}
                />
            </div>
        )
    }

    return (
        <>
            <h1>Exportar avaliações</h1>
            <div className={styles.container}>
                {students.length !== 0 &&
                    <Typeahead
                        className={styles.typeahead_container}
                        placeholder="Nome do estudante"                            
                        options={students}
                        labelKey={ (option) => option.name }
                        onChange={handleStudentChange}                                   
                    />
                }
                {
                    isSelectedStudent &&
                    
                        selectedStudent.evaluations.map( (evalId) => (
                            generateEvaluationReport(evalId)
                        ))
                }

            </div>
        </>
    )
}

export default EvaluationExportPage