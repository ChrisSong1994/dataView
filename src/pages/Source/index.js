import React, { Component } from 'react';
import { observer, inject } from "mobx-react"
import { toJS } from 'mobx'
import { Table, Drawer, Modal, Input, Button, Icon } from 'antd';
import _ from 'lodash'
import Coder from 'src/components/Coder'
import "./index.scss";

const { Search } = Input;

@inject("sourceStore")
@observer
class Source extends Component {
    constructor() {
        super()
        this.state = {}
    }

    componentDidMount() {
        this.props.sourceStore.querySources()
    }

    createColumns() {
        return [
            {
                title: "数据源名称",
                dataIndex: "name",
                width: 250
            },
            {
                title: "描述",
                dataIndex: "description"
            },
            {
                title: "创建日期",
                dataIndex: "createDate",
                width: '20%',
                render: (text) => { return text }
            },
            {
                title: "变更日期",
                dataIndex: "updateDate",
                width: '20%',
                render: (text) => { return text }
            },
            {
                title: "操作",
                width: 200,
                render: (text, data) => {
                    return (
                        <div className="operate">
                            <a onClick={this.handleDelete.bind(this, data.id, data.name)} href="javascript:;">删除</a>
                            &nbsp; &nbsp; &nbsp;
                            <a onClick={this.handleView.bind(this, data.id, data.name)} href="javascript:;">查看</a>
                        </div>
                    )
                }
            }
        ]
    }


    handleView(id, name) {
        this.props.sourceStore.getSourceById(id, name)
    }

    handleDelete(id, name) {
        Modal.confirm({
            title: `是否确认删除 ${name}？`,
            onOk: () => {
                this.props.sourceStore.deleteSourceById(id)
            },
            cancelText: '取消',
            okText: "确认"
        })
    }

    handleDrawerClose() {
        this.props.sourceStore.setDrawerVisible(false)
    }

    handleSearch(e) {
        let key = e.target.value
        this.props.sourceStore.changeQuery({ searchKey: _.trim(key) })
    }

    render() {
        const { isDrawerVisible, dataLoading, sourceList, sourceTotal, queryParams } = this.props.sourceStore
        return (
            <div className="source">
                <div className="options clearfix">
                    <div className="option-search fl">
                        <Search
                            allowClear
                            placeholder="请输入..."
                            value={queryParams.searchKey}
                            onChange={this.handleSearch.bind(this)}
                            style={{ width: 300 }} />
                    </div>
                    <div className="option-buttons fr">
                        <Button type="primary" icon="plus">新增数据源</Button>
                    </div>
                </div>
                <Table
                    loading={dataLoading}
                    pagination={{
                        showSizeChanger: true,
                        total: sourceTotal,
                        onShowSizeChange: (pageNum, pageSize) => {
                            this.props.sourceStore.changeQuery({ pageNum, pageSize })
                        },
                        onChange: (pageNum) => {
                            this.props.sourceStore.changeQuery({ pageNum })
                        }
                    }}
                    columns={this.createColumns()}
                    dataSource={toJS(sourceList)} />
                <Drawer
                    title="Multi-level drawer"
                    width={1100}
                    closable={true}
                    onClose={this.handleDrawerClose.bind(this)}
                    visible={isDrawerVisible}
                >
                    <Coder />
                </Drawer>
            </div>
        )
    }
}

export default Source