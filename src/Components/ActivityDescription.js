import styles from "./ActivityDescription.module.css"
import { Table } from "react-bootstrap"

function ActivityDescription( {selectedActivity, studentsPerClass, handleStudentChange} ) {
    return (
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
    )
}

export default ActivityDescription