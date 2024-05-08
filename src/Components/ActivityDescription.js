import styles from "./ActivityDescription.module.css"
import { Table } from "react-bootstrap"

function ActivityDescription( {selectedActivity, includesGrade, grades} ) {
    return (
            <div className={styles.container}>
                <h4>{selectedActivity.title}:</h4>
                <p>{selectedActivity.description}</p>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Critério</th>
                            <th>Peso</th>
                            <th>Descrição</th>
                            {includesGrade && 
                                <th>Nota</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            selectedActivity.criteria.map( (crit) => (
                                <tr>
                                    <td>{crit.short_name}</td>
                                    <td>{crit.weight}</td>
                                    <td>{crit.description}</td>
                                    {includesGrade &&
                                        <td>XXX</td>
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
    )
}

export default ActivityDescription