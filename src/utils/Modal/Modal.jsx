import React, { useState } from 'react'
import { Modal } from '@mantine/core';
const Modal = () => {
     const [modalOpen, setModalOpen] = useState(false);
    return (
        <div>
            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title="File Details"
                size='full'
                styles={{
                    content: { width: 1600 }
                }}
                centered
                withCloseButton
            >
                <div className={themeClass} style={{ height: 500, width: '100%', paddingBottom: "10px" }}>
                    <AgGridReact
                        rowData={selectedFile}
                        columnDefs={columnDefsForModal}
                        defaultColDef={defaultColDef}
                        domLayout="autoHeight"
                        theme="legacy"
                    />
                </div>
            </Modal>
        </div>
    )
}

export default Modal
