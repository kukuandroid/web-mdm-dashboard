import React, { Component } from 'react'
import WinJS from 'winjs'
import FleetsTaskItemList from './FleetsTaskItemList'
import Confirmation from '../../../../components/Confirmation'

const POLICIES_CAN_MULTIPLE_VALUE = [
    14, // -> Deploy Application
    16, // -> Deploy File
]

class FleetsContent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            layout: { type: WinJS.UI.ListLayout }
        }
    }
    
    handleFleetHaveTask = policy => {
        let policyId = null
        const haveTask = this.props.data.tasksData.some((task) => {
            policyId = task['plugin_flyvemdm_policies_id']
            return policyId === policy['PluginFlyvemdmPolicy.id']
        });
        return haveTask
    } 

    filterPoliciesPerCategory = () => {
        //  TODO: Set State called: `policiesPerCategory`
        const policiesPerCategory = []

        this.props.data.policyCategoriesData.forEach(category => {
            let obj = {}
            let categoryCompleteName = category['PluginFlyvemdmPolicyCategory.completename']
            let policiesPerThisCategory = this.props.data.policiesData.filter(policy => {
                // Check if the current Fleet have a Task that have a relation with this Policy
                policy['fleetHaveTask'] = this.handleFleetHaveTask(policy) 
                // Check if the same Policy Category name is equal to the Category name
                return policy['PluginFlyvemdmPolicy.PluginFlyvemdmPolicyCategory.completename'] === categoryCompleteName
            })
            console.log('[Politicas por categoria]', categoryCompleteName, policiesPerThisCategory)
            obj['name'] = categoryCompleteName
            obj['id'] = category['PluginFlyvemdmPolicyCategory.id']
            obj['policies'] = policiesPerThisCategory
            policiesPerCategory.push(obj)
        });

        return policiesPerCategory
    }

    componentDidMount = () => {
        !this.props.data.fleetSelected && this.props.history.push('/app/fleets')
        !this.props.data.fleetSelected || this.props.data.fetchTasks()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.fleetSelected !== this.props.data.fleetSelected && nextProps.data.fleetSelected !== null) {
            nextProps.data.fetchTasks()
        }
    }

    render() {
        let policiesPerCategory

        if (this.props.data.fleetSelected 
        &&  this.props.data.policyCategoriesData
        &&  this.props.data.tasksData) {
            policiesPerCategory = this.filterPoliciesPerCategory()
        } 

        return this.props.data.fleetSelected ? 
            ( 
                <div>
                    <div className="contentHeader">
                        <h1 className="win-h1 titleContentPane"> Fleets </h1>
                        <div className="itemInfo">
                            <div className="contentStatus">
                                <div className="name">{this.props.data.fleetSelected["PluginFlyvemdmFleet.name"]}</div>
                                <br />
                                <span className="editIcon" style={{ marginRight: '20px' }} onClick={this.handleEdit} />
                                <span className="deleteIcon" onClick={this.handleDelete} />
                            </div>
                        </div>
                    </div>
                    <div className="separator" />
                    <div className="contentInfo" style={{ width: '100%', marginTop: '20px', marginBottom: '20px', display: 'inline-block' }} >
                        <h3 className="win-h3" style={{ display: 'inline-block' }} > Tasks per Category </h3>
                    </div>
                    <div className="separator" />
                    { policiesPerCategory ? (
                        policiesPerCategory.map((category) => {
                            return category['policies'].length > 0 
                                ? (
                                    <div key={category['id']}>
                                        <h2>
                                            {category['name']}
                                        </h2>
                                        <div>
                                            {category['policies'].map((policy, index) => (
                                                <FleetsTaskItemList
                                                key={[policy['PluginFlyvemdmPolicy.name'], index].join("_")}
                                                data={policy} 
                                                addedPolicy={policy['fleetHaveTask']}
                                                multiplesValues={POLICIES_CAN_MULTIPLE_VALUE.includes(policy['PluginFlyvemdmPolicy.id'])} />
                                            ))}
                                        </div>
                                    </div>
                                )
                                : null
                        })
                    ) : <h1>Loading Tasks, Policies and Categories</h1>}

                    <Confirmation title={`Delete Fleet`} message={this.props.data.fleetSelected["PluginFlyvemdmFleet.name"]} reference={el => this.contentDialog = el} />
                </div>
            )
            : null
    }
}

export default FleetsContent