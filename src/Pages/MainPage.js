import { useEffect, useState } from "react"
import styles from "./MainPage.module.css"
import Form from 'react-bootstrap/Form'
import { Table } from "react-bootstrap"

function MainPage() {

    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedActivity, setSelectedActivity] = useState({})
    const [isSelectedActivity, setIsSelectedActivity ] = useState(false)

    const BASE_API_URL = 'http://localhost:5000/'

    useEffect( () => {
        listCourses()
    }, [])

    useEffect( () => {
        console.log(classes)
    }, [classes])

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

    function handleCourseChange(e) {
        listClassesPerCourse(e.target.value)
        setActivities([])
    }

    function handleClassChange(e) {
        listActivitiesPerClass(e.target.value, 10)
    }

    function handleActivityChange(e) {
        var id = e.target.value
        fetch(`${BASE_API_URL}activities/${id}/`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            setSelectedActivity(data)
            setIsSelectedActivity(true)
            console.log(data)
        })
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
                    </>

            }

        </div>
    )
}

export default MainPage