import React from 'react'
import Input from 'antd/es/input/Input'
const Inputs = ({value, setValue, val, readonly}: {value: number | undefined, setValue:(val : number)=>void, val: string, readonly: boolean}) => {
    return (
        <Input
            value={value}
            type="number"
            placeholder={val === 'Eth' || val === 'Ant' ? "Enter lp" : "0 to 1000"}
            prefix={<InputPrefix val={val} />}
            onChange={(e) => setValue(Number(e.target.value))}
            style={{
                color: 'white',
                padding: 20,
                margin: 4,
                borderColor: 'white',
                background: '#222222',
            }}
            readOnly={readonly}
            className="custom-input"
        />
    )
}

export default Inputs

const InputPrefix = ({ val }: { val: string }) => {
    return (
      <div className='flex flex-col'>
        <h1 className={`text-white ${val === 'Eth' || val == 'Ant' ? 'text-sm' : 'text-lg'} font-mono`}>{val}</h1>
        {/* <h1 className='' style={{ color: '#FFF5E4', fontSize:12}}>Balance 2 </h1> */}
      </div>
    )
}