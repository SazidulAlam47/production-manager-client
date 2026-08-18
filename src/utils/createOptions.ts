import capitalize from './capitalize';

const createOptions = (array: string[]) => {
    return array.map((item) => ({ value: item, label: capitalize(item) }));
};

export default createOptions;
