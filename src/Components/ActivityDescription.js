import styles from "./ActivityDescription.module.css"
import { Form, Table } from "react-bootstrap"

function ActivityDescription( {activity, includesGrade, grades, comments} ) {

    function calculateFinalGrade() {
        var finalGrade = 0.0;
        for (let id = 0; id < activity.criteria.length; id++) {
            const critWeight = activity.criteria[id].weight;
            const critGrade = grades[id].grade;
            finalGrade += (critWeight * critGrade);                
        }
        return finalGrade
    }

    return (
            <div className={styles.container}>
                <h4>{activity.title}</h4><br/>
                {activity.description !== "" &&
                    <p><strong>Descrição:</strong> {activity.description}</p>
                }
                {activity.url !== "" &&
                    <p><strong><a href={activity.url} target="_blank">URL da Atividade</a> </strong></p>
                }
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th className="text-center">Critério</th>
                            <th className="text-center">Peso</th>
                            <th className="text-center">Descrição</th>
                            {includesGrade && 
                                <th className="text-center table-success">Nota</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            activity.criteria.map( (crit) => (
                                <tr>
                                    <td>{crit.short_name}</td>
                                    <td>{crit.weight * 100}%</td>
                                    <td>{crit.description}</td>
                                    {includesGrade &&
                                        <td className="table-success">{grades.filter( (grad) => grad.crit === crit.short_name)[0].grade }</td>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                {includesGrade &&
                    <>
                        <p><strong>Comentários:</strong> {comments} </p>
                        <p><strong>Nota final:</strong> {calculateFinalGrade().toFixed(1).replace('.',',') }</p>
                    </>
                }
            </div>
    )
}

export default ActivityDescription