import { Table } from "react-bootstrap"
import styles from './EvaluationViewTable.module.css'

function EvaluationViewTable( {activity, tableInfo, students}  ) {

    function getGradesForTable(evalu) {
        if(evalu === undefined) {
            return (
                <>
                {
                    activity.criteria.map( (crit) => (
                        <td></td>
                    ))
                }
                <td></td>
                </>
            )
        }
        else {
            var finalGrade = 0.0;
            for (let id = 0; id < activity.criteria.length; id++) {
                const critWeight = activity.criteria[id].weight;
                const critGrade = evalu.grades[id].grade;
                finalGrade += (critWeight * critGrade);                
            }
            return (
                <>
                {
                    evalu.grades.map( (grade) => (
                        <td>{grade.grade}</td>
                    ))
                }
                <td>{finalGrade}</td>
                </>
            )
        }
    }

    function getTableHeader() {
        return (
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Matrícula</th>
                    {
                        activity.criteria.map( (crit) => (
                            <th>{crit.short_name} ({crit.weight*100}%)</th>
                        ))
                    }
                    <th>Nota</th>
                    <th>Comentários</th>
                </tr>
            </thead>
        )
    }


    return (
        <div className={styles.container}>
            <Table bordered striped>
                {getTableHeader()}
                <tbody>
                
                    {
                    tableInfo.map( (info) => (
                        <tr>
                            <td>{info.student.name}</td>
                            <td>{info.student.code}</td>
                            {getGradesForTable(info.eval)}
                            <td></td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>        
        </div>
    )
}

export default EvaluationViewTable