import { useEffect, useState } from "react";
import { Table, Modal, Button } from "react-bootstrap"
import styles from './EvaluationViewTable.module.css'

function CommentsModal(props) {
    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Comentários:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {props.comments}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      )
}

function EvaluationViewTable( {activity, tableInfo}  ) {

    const [modalShow, setModalShow] = useState(false)
    const [commentsAtModal, setCommentsAtModal] = useState("test")

    useEffect( () => {
    }, [commentsAtModal])

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

    function handleModalBtnClick(e) {
        console.log(e.target.id)

        var comments = ""
        tableInfo.forEach(info => {
            if(info.eval) {
                if(info.eval.id === e.target.id) {
                    comments = info.eval.comments
                }
            }
        });
        setCommentsAtModal(comments)
        setModalShow(true)
    }

    return (
        <div className={styles.container}>
            <Table bordered striped>
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
                        <th className="text-center">Comentários</th>

                    </tr>
                </thead>
                <tbody>
                
                    {
                    tableInfo.map( (info) => (
                        <tr>
                            <td>{info.student.name}</td>
                            <td>{info.student.code}</td>
                            {getGradesForTable(info.eval)}
                            { info.eval ?
                                <td>
                                    {
                                        <Button id={info.eval.id} variant="primary" size="sm" onClick={handleModalBtnClick}>
                                            Abrir
                                        </Button>
                                    }
                                </td>
                                :
                                <td></td>
                            }
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
            <CommentsModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                comments={commentsAtModal}
            />    
        </div>
    )
}

export default EvaluationViewTable