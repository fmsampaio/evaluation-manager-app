import { useEffect, useRef, useState } from "react"
import styles from "./EvaluationPage.module.css"
import { Typeahead } from "react-bootstrap-typeahead"

import MainSelection from "../Components/MainSelection"
import ActivityDescription from "../Components/ActivityDescription"
import EvaluationForm from "../Components/EvaluationForm"

function EvaluationPage() {

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

    const studentTypeAheadRef = useRef(null)

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

    function handleCourseChange(e) {
        listClassesPerCourse(e.target.value)
        setActivities([])
    }

    function handleClassChange(e) {
        listActivitiesPerClass(e.target.value)
        retrieveStudentsPerClass(e.target.value)
    }

    function resetGrades(act) {
        var grades = []
        act.criteria.map( (crit) => {
            grades.push({
                crit : crit.short_name,
                grade : 10
            })                
        })
        setGrades(grades)
    }

    function handleActivityChange(e) {
        var actId = e.target.value
        var act = activities.filter( (act) => act.id === actId)[0]
        setSelectedActivity(act)
        setIsSelectedActivity(true)        
        resetGrades(act)        
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
            console.log("[INFO] Avaliação atualizada na rota students!")
        })
    }

    function updateActivityWithEval(idEval) {
        selectedActivity.evaluations.push(idEval)
        var patchBody = {
            evaluations : selectedActivity.evaluations
        }
        fetch(`${BASE_API_URL}activities/${selectedActivity.id}/`, {
            method : "PATCH",
            body : JSON.stringify(patchBody),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then( (resp) => (resp.json()))
        .then( (data) => {
            console.log("[INFO] Avaliação atualizada na rota activities!")
        })
    }

    function resetGuiForNewStudentSelection() {
        setIsSelectedStudent(false)
        setSelectedStudent({})
        setGrades([])
        setComments("")
        studentTypeAheadRef.current.clear()
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
            updateActivityWithEval(idEval)
            resetGuiForNewStudentSelection()
            resetGrades(selectedActivity)
        }
        )
    }

    function handleGradeInputChange(e) {
        var intGrade = parseInt(e.target.value)

        if(intGrade < 0) {
            e.target.value = "0"
            intGrade = 0
        }
        if(intGrade > 10) {
            e.target.value = "10"
            intGrade = 10
        }
        
        var newGrades = []
        for (let i = 0; i < grades.length; i++) {
            if(grades[i].crit === e.target.id) {
                var newGrade = {
                    crit : grades[i].crit,
                    grade : intGrade
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
        <>
            <h1>Realizar avaliações</h1>
            <div className={styles.container}>
                
                <div className={styles.side_container}>
                    <MainSelection 
                        handleCourseChange={handleCourseChange}
                        handleClassChange={handleClassChange}
                        handleActivityChange={handleActivityChange}
                        courses={courses}
                        classes={classes}
                        activities={activities}
                    />

                    {
                        isSelectedActivity &&
                            <>
                                <ActivityDescription 
                                    handleStudentChange={handleStudentChange} 
                                    studentsPerClass={studentsPerClass}
                                    selectedActivity={selectedActivity}
                                />
                                
                            </>                    
                    }
                </div>
                <div className={styles.side_container}>
                    {
                        isSelectedActivity &&
                            <div className={styles.student_type_container}>
                                <h4>Selecione um estudante:</h4>
                                <Typeahead
                                    placeholder="Nome do estudante"                            
                                    options={studentsPerClass}
                                    labelKey={ (option) => option.name }
                                    onChange={handleStudentChange}
                                    ref={studentTypeAheadRef}                                    
                                />
                            </div>
                    }
                    {
                        isSelectedStudent && 
                            <EvaluationForm 
                                comments={comments}
                                handleCommentsChange={handleCommentsChange}
                                handleSalvarClick={handleSalvarClick}
                                handleGradeInputChange={handleGradeInputChange}
                                selectedActivity={selectedActivity}
                            />
                    }
                </div>
            </div>
        </>
    )
}

export default EvaluationPage
