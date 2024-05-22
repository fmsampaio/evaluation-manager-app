import { useEffect, useState } from "react"
import styles from "./EvaluationViewPage.module.css"
import MainSelection from "../Components/MainSelection"
import EvaluationViewTable from "../Components/EvaluationViewTable"
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap"


function EvaluationViewPage() {
    const [courses, setCourses] = useState([])
    const [classes, setClasses] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedActivity, setSelectedActivity] = useState({})
    const [isSelectedActivity, setIsSelectedActivity] = useState(false)
    const [studentsPerClass, setStudentsPerClass] = useState([])
    const [evaluationsTableInfo, setEvaluationsTableInfo] = useState([])

    const BASE_API_URL = 'http://localhost:5000/'

    const [showToolTip, setShowToolTip] = useState(false);
    const [showAllToolTip, setShowAllToolTip] = useState(false);

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
            evaluationsForTable.sort( (elemA, elemB) => {
                if(elemA.student.name < elemB.student.name) return -1
                if(elemA.student.name > elemB.student.name) return 1
                return 0
            } )
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

    function handleCopyAllBtnOnClick(e) {
        var output = ''

        evaluationsTableInfo.map( (info) => {
            var evaluation = info.eval
            if(evaluation === undefined) {
                selectedActivity.criteria.map( (crit) => {
                    output += ';'
                })
                output += ';'
            }
            else {
                var finalGrade = 0.0;
                for (let id = 0; id < selectedActivity.criteria.length; id++) {
                    const critWeight = selectedActivity.criteria[id].weight;
                    const critGrade = evaluation.grades[id].grade;
                    finalGrade += (critWeight * critGrade);                
                }
                
                evaluation.grades.map( (grade) => {
                    output += grade.grade + ';'
                })
                output += finalGrade.toFixed(1).replace('.',',')
            }
            output += '\n'    
        })
        navigator.clipboard.writeText(output)
        setShowAllToolTip(true);
    }

    function handleCopyFinalBtnOnClick(e) {
        var output = ''

        evaluationsTableInfo.map( (info) => {
            var evaluation = info.eval
            if(evaluation !== undefined) {
                var finalGrade = 0.0;
                for (let id = 0; id < selectedActivity.criteria.length; id++) {
                    const critWeight = selectedActivity.criteria[id].weight;
                    const critGrade = evaluation.grades[id].grade;
                    finalGrade += (critWeight * critGrade);                
                }
                output += finalGrade.toFixed(1).replace('.',',')
            }
            output += '\n'    
        })
        navigator.clipboard.writeText(output)
        setShowToolTip(true);
    }

    const renderTooltip = props => (
        <Tooltip {...props}>Dados copiados!</Tooltip>
    )

    const handleAllToolTipToggle = (show) => { 
        if (show) { 
            setTimeout(() => { 
                setShowAllToolTip(false); 
            }, 1000);
        } 
    }

    const handleToolTipToggle = (show) => { 
        if (show) { 
            setTimeout(() => { 
                setShowToolTip(false); 
            }, 1000);
        } 
    }

    return (
        <>
            <h1>Visualizar avaliações</h1>
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
                    {isSelectedActivity &&
                        <div className={styles.btns_container}>
                            <OverlayTrigger placement="top" overlay={renderTooltip} show={showAllToolTip} onToggle={handleAllToolTipToggle}>
                                <Button onClick={handleCopyAllBtnOnClick}>Copiar todas</Button>                        
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip} show={showToolTip} onToggle={handleToolTipToggle}>
                                <Button onClick={handleCopyFinalBtnOnClick}>Copiar finais</Button>                        
                            </OverlayTrigger>
                        </div>
                    }
                </div>
                <div className={styles.right_container}>
                    {isSelectedActivity &&
                        <EvaluationViewTable 
                            activity={selectedActivity}
                            tableInfo={evaluationsTableInfo}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default EvaluationViewPage