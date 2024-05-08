import ActivityDescription from './ActivityDescription'
import styles from './EvaluationReport.module.css'

function EvaluationReport( {activity} ) {
    return (
        <div>
            <ActivityDescription
                selectedActivity={activity}
            />
        </div>
    )
}

export default EvaluationReport