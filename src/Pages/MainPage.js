import { useEffect, useState } from "react"
import {styles} from "./MainPage.module.css"
import Form from 'react-bootstrap/Form'

function MainPage() {

    const [courses, setCourses] = useState([])

    const BASE_API_URL = 'http://localhost:5000/'

    useEffect( () => {
        listCourses()
    }, [])

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

    return (
        <div>
            <h1>Gerenciador de avaliações</h1>
            <Form.Select aria-label="Curso">
                <option>Selecione um curso</option>
                {
                    courses.map( (course) => (
                        <option value={course.id}>{course.name}</option>
                    )) 
                }
            </Form.Select>
        </div>
    )
}

export default MainPage