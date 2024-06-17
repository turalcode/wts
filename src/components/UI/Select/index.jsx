const Select = ({data, value, callback}) => {
    return (
        <select onChange={callback} value={value}>
            {data.map((item) => {
                return (
                    <option key={item.name} value={item.value}>
                        {item.name}
                    </option>
                );
            })}
        </select>
    );
};

export default Select;
