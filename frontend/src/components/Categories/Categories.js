import { Button } from 'react-bootstrap'

const Categories = ({ filterItems, allCategories }) => {
  return (
    <div className='btn-container'>
      {allCategories.map((category, index) => (
        <Button
          variant='outline-primary'
          key={index}
          className='me-1'
          onClick={() => filterItems(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}

export default Categories
