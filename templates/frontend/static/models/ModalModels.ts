class ModalModel {
    title?: string;
    content?: string;
    icon?: string;
    buttons?: { label: string; value: any; color: string; }[];
}

export const ModalModels = {
    getDeleteModel: (resourceName: string): ModalModel => {
        return {
            title: '¿Eliminar registro?',
            icon: 'ti-alert',
            content: `¿Confirma eliminar permanentemente este ${resourceName}?`,
            buttons: [
                { label: 'Cancelar', value: false, color: 'light' },
                { label: 'Confirmar borrado', value: true, color: 'danger' }
            ]
        };
    }
};
