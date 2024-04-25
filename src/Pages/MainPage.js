import { useEffect, useState } from "react"
import styles from "./MainPage.module.css"
import Form from 'react-bootstrap/Form'
import { Button, Table } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead"

function MainPage() {

    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedActivity, setSelectedActivity] = useState({})
    const [isSelectedActivity, setIsSelectedActivity] = useState(false)
    const [studentsPerClass, setStudentsPerClass] = useState([])
    const [isSelectedStudent, setIsSelectedStudent] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState({})
    const [grades, setGrades] = useState([])
    const [comments, setComments] = useState("")

    const BASE_API_URL = 'http://localhost:5000/'

    useEffect( () => {
        listCourses()
    }, [])

    useEffect( () => {
        console.log(classes)
    }, [classes])

    useEffect( () => {
        console.log(studentsPerClass)
    }, [studentsPerClass])

    useEffect( () => {
        console.log(grades)
    }, [grades])

    function listCourses() {
        fetch(`${BASE_API_URL}courses/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            setCourses(data)           
        })
    }

    function listClassesPerCourse(selectedCourseId) {
        fetch(`${BASE_API_URL}classes/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            setClasses(data.filter( (elem) => elem.course_id === selectedCourseId))           
        })
    }

    function listActivitiesPerClass(selectedClassId) {
        fetch(`${BASE_API_URL}activities/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            setActivities(data.filter( (act) => act.class_id === selectedClassId))           
        })
    }

    function retrieveStudentsPerClass(idClass) {
        const selectedClass = classes.filter( (cls) => cls.id === idClass )[0]
        fetch(`${BASE_API_URL}students/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            setStudentsPerClass(data.filter( (stu) => selectedClass.students.includes(stu.id)))
        })
    }

    function handleCourseChange(e) {
        listClassesPerCourse(e.target.value)
        setActivities([])
    }

    function handleClassChange(e) {
        listActivitiesPerClass(e.target.value)
        retrieveStudentsPerClass(e.target.value)
    }

    function handleActivityChange(e) {
        var actId = e.target.value
        var act = activities.filter( (act) => act.id === actId)[0]
        setSelectedActivity(act)
        setIsSelectedActivity(true)        

        var grades = []
        act.criteria.map( (crit) => {
            grades.push({
                crit : crit.short_name,
                grade : -1
            })                
        })
        setGrades(grades)
    }

    function handleStudentChange(e) {
        setIsSelectedStudent(true)
        setSelectedStudent(e[0])
    }

    function updateStudentWithEval(idEval) {
        selectedStudent.evaluations.push(idEval)
        var patchBody = {
            evaluations : selectedStudent.evaluations
        }
        fetch(`${BASE_API_URL}students/${selectedStudent.id}/`, {
            method : "PATCH",
            body : JSON.stringify(patchBody),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            console.log("Avaliação salva com sucesso!")
        })
    }

    function handleSalvarClick() {
        var evaluation = {
            activity_id : selectedActivity.id,
            student_id : selectedStudent.id,
            grades : grades,
            "comments" : comments
        }

        
        fetch(`${BASE_API_URL}evaluations/`, {
            method : "POST",
            body : JSON.stringify(evaluation),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            console.log(data)
            const idEval = data.id
            updateStudentWithEval(idEval)
        }
        )
    }

    function handleGradeInputChange(e) {
        var newGrades = []
        for (let i = 0; i < grades.length; i++) {
            if(grades[i].crit === e.target.id) {
                var newGrade = {
                    crit : grades[i].crit,
                    grade : parseInt(e.target.value)
                }                
                newGrades.push(newGrade)
            }    
            else {
                newGrades.push(grades[i])
            }        
        }
        setGrades(newGrades)
    }

    function handleCommentsChange(e) {
        setComments(e.target.value)
    }

    return (
        <div>
            <h1>Gerenciador de avaliações</h1>
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
                        <option value={classElem.id}>{classElem.name}</option>
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

            {
                isSelectedActivity &&
                    <>
                        <h2>{selectedActivity.title}</h2>
                        <p>{selectedActivity.description}</p>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Critério</th>
                                    <th>Peso</th>
                                    <th>Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    selectedActivity.criteria.map( (crit) => (
                                        <tr>
                                            <td>{crit.short_name}</td>
                                            <td>{crit.weight}</td>
                                            <td>{crit.description}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                        <Form.Select onChange={handleStudentChange} aria-label="Class">
                            <option>Selecione um estudante</option>
                            {
                                studentsPerClass.map( (stu) => (
                                    <option  value={stu.id}>{stu.name}</option>
                                ))
                            }
                        </Form.Select>
                        <Typeahead
                            placeholder="Selecione um estudante"                            
                            options={studentsPerClass}
                            labelKey={ (option) => option.name }
                            onChange={handleStudentChange}

                        />
                    </>

            }
            {
                isSelectedStudent && 
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
            }

        </div>
    )
}

export default MainPage
