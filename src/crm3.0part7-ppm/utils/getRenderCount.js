export const renderCount = {
    bindKeys: ['formStruct', 'tabStruct', 'dataStruct'],
    count: 0,
    getCount(obj) {
        Object.keys(obj).forEach(key => {
            if (key == 'formStruct') {
                this.count++
                if (obj['formStruct'].attrs && obj['formStruct'].attrs.length > 0) {
                    obj['formStruct'].attrs.forEach(attr => {
                        this.getCount(attr)
                    })
                }
            }
            if (key == 'tabStruct' && obj.tabStruct.length > 0) {
                obj.tabStruct.forEach(tabStruct => {
                    this.count++
                    if (tabStruct.attrs && tabStruct.attrs.length > 0) {
                        tabStruct.attrs.forEach(attr => {
                            this.getCount(attr)
                        })
                    }
                })
            }
            if (key == 'dataStruct' && obj.dataStruct.length > 0) {
                obj.dataStruct.forEach(dataStruct => {
                    this.count++
                    if (dataStruct.attrs && dataStruct.attrs.length > 0) {
                        dataStruct.attrs.forEach(attr => {
                            this.getCount(attr)
                        })
                    }
                })
            }
        });
        return this.count
    },
    restCount(){
        this.count = 0
    }
}