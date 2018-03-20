import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FilesEditItemList from './FilesEditItemList'
import ContentPane from '../../../components/ContentPane'
import Loading from '../../../components/Loading'

export default class FilesEdit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedItem:[],
            isLoading: false
        }
    } 

    updateItemList = (index, name) => {
        let newItem = [...this.state.selectedItem]

        //Find index of specific object using findIndex method.    
        let objIndex = newItem.findIndex((obj => obj["id"] === index));

        // Update object's name property.
        if(objIndex !== -1) {
            newItem[objIndex]["name"] = name
        } else {
            const item = {"id": index, "name": name}
            newItem.push(item)
        }

        this.setState({
            selectedItem: newItem
        })
    }

    handleSaveFiles = async () => {
        
        try {
            if (this.state.selectedItem.length > 0) {

                this.setState({
                    isLoading: true
                })
                await this.props.glpi.updateItem({ itemtype: "PluginFlyvemdmFile", input: this.state.selectedItem})

                if (this.state.selectedItem.length > 1) {
                    this.props.setNotification({
                        title: 'Successfully',
                        body: 'Edited files',
                        type: 'success'
                    })
                } else {
                    this.props.setNotification({
                        title: 'Successfully',
                        body: 'Edited file',
                        type: 'success'
                    })
                }

                this.props.changeSelectionMode(false)
                this.props.changeAction("reload")
            }
            
        } catch (error) {

            this.setState({
                isLoading: false
            })

            if (error.length > 1) {
                this.props.setNotification({
                    title: error[0],
                    body: error[1],
                    type: 'alert'
                })
            } else {
                this.props.setNotification({
                    title: 'Error',
                    body: `${error}`,
                    type: 'alert'
                })
            }
        }
    }

    render() {

        if (this.props.selectedItems) {

            if (this.state.isLoading) {
                return (<Loading message="Loading..." />)
            } else {
                let renderComponent = this.props.selectedItems.map((item, index) => {

                    return (
                        <FilesEditItemList
                            key={index}
                            updateItemList={this.updateItemList}
                            selectedItem={item}
                        />
                    )
                })

                return (
                    <ContentPane>
                        <button className="btn --primary" onClick={this.handleSaveFiles}>Save</button>
                        <div className="separator" />
                        {renderComponent}
                    </ContentPane>
                )
            }

        } else {
            return null
        }
    }
}
FilesEdit.propTypes = {
    selectedItems: PropTypes.array,
    changeSelectionMode: PropTypes.func.isRequired,
    action: PropTypes.string,
    changeAction: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired,
    glpi: PropTypes.object.isRequired
}