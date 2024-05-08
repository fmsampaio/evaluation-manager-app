import { useEffect, useState } from 'react'
import styles from './EvaluationExportPage.module.css'
import { Typeahead } from 'react-bootstrap-typeahead'

function EvaluationExportPage() {

    const [students, setStudents] = useState([])
    const [isSelectedStudent, setIsSelectedStudent] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState({})

    const BASE_API_URL = 'http://localhost:5000/'

    useEffect( () => {
        listStudents()
    }, [])

    function listStudents() {
        fetch(`${BASE_API_URL}students/`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then( (resp) => resp.json() )
        .then( (data) => { 
            setStudents(data)
        })
    }

    function handleStudentChange(e) {
        setSelectedStudent(e[0])
        setIsSelectedStudent(true)
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
                    <p>{JSON.stringify(selectedStudent)}</p>
                }

            </div>
        </>
    )
}

export default EvaluationExportPage