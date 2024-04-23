import { useEffect, useState } from "react"
import styles from "./MainPage.module.css"
import Form from 'react-bootstrap/Form'

function MainPage() {

    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [activities, setActivities] = useState([])

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
        listClassesPerCourse(parseInt(e.target.value, 10))
        setActivities([])
    }

    function handleClassChange(e) {
        listActivitiesPerClass(parseInt(e.target.value, 10))
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

            <Form.Select aria-label="Class">
                <option>Selecione uma atividade</option>
                {
                    activities.map( (act) => (
                        <option value={act.id}>{act.title}</option>
                    ))
                }
            </Form.Select>

        </div>
    )
}

export default MainPage