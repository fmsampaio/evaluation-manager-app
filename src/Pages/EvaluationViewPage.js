import { useEffect, useState } from "react"
import styles from "./EvaluationViewPage.module.css"
import MainSelection from "../Components/MainSelection"
import EvaluationViewTable from "../Components/EvaluationViewTable"


function EvaluationViewPage() {
    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedActivity, setSelectedActivity] = useState({})
    const [isSelectedActivity, setIsSelectedActivity] = useState(false)
    const [studentsPerClass, setStudentsPerClass] = useState([])
    const [evaluationsTableInfo, setEvaluationsTableInfo] = useState([])

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

    function listEvaluationsTableInfo(act) {
        fetch(`${BASE_API_URL}evaluations/`, {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        .then( (resp) => (
            resp.json()
        ))
        .then( (data) => {
            var evaluationsForTable = []
            studentsPerClass.map( (stu) => {
                var evals = data.filter( (evalu) => evalu.student_id === stu.id && evalu.activity_id === act.id )
                var stuEval = evals[evals.length-1]

                var tableRowInfo = {
                    student : stu,
                    eval : stuEval
                }
                evaluationsForTable.push(tableRowInfo)
            })
            setEvaluationsTableInfo(evaluationsForTable)
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
        listEvaluationsTableInfo(act)
    }

    

    return (
        <>
            <h1>Visualização de avaliações</h1>
            <div className={styles.container}>
                <div className={styles.left_container}>
                    <MainSelection 
                        handleCourseChange={handleCourseChange}
                        handleClassChange={handleClassChange}
                        handleActivityChange={handleActivityChange}
                        courses={courses}
                        classes={classes}
                        activities={activities}
                    />
                </div>
                <div className={styles.right_container}>
                    {isSelectedActivity &&
                        <EvaluationViewTable 
                            activity={selectedActivity}
                            students={studentsPerClass}
                            tableInfo={evaluationsTableInfo}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default EvaluationViewPage