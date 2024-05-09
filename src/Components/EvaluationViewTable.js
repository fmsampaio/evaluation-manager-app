import { Table } from "react-bootstrap"
import styles from './EvaluationViewTable.module.css'

function EvaluationViewTable( {activity, tableInfo}  ) {

    function getGradesForTable(evalu) {
        if(evalu === undefined) {
            return (
                <>
                {
                    activity.criteria.map( (crit) => (
                        <td></td>
                    ))
                }
                <td  className="table-success"></td>
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
                <td className="table-success">{finalGrade.toFixed(1).replace('.',',')}</td>
                </>
            )
        }
    }

    function getTableHeader() {
        return (
            <thead className="thead-dark">
                <tr>
                    <th className="text-center">Nome</th>
                    <th className="text-center">Matrícula</th>
                    {
                        activity.criteria.map( (crit) => (
                            <th className="text-center">{crit.short_name} ({crit.weight*100}%)</th>
                        ))
                    }
                    <th className="text-center table-success">Nota</th>
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
                        </tr>
                    ))
                    }
                </tbody>
            </Table>        
        </div>
    )
}

export default EvaluationViewTable