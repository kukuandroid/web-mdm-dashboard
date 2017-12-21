import React from 'react'
import HeaderAdminDashboard from './HeaderAdminDashboard'
import BodyAdminDashboard from './BodyAdminDashboard'
import PropTypes from 'prop-types'

class App extends React.Component {

    render () {
        return (
            <div style={{height: '100%'}}>
                <HeaderAdminDashboard history={this.props.history}/>
                <BodyAdminDashboard />
            </div>
        )
    }
}

App.propTypes = {
    history: PropTypes.object.isRequired
}

export default App