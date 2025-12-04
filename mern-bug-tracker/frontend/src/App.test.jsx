import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import axios from 'axios'

vi.mock('axios')

test('renders heading and allows reporting a bug', async () => {
  axios.get.mockResolvedValue({ data: [] })
  axios.post.mockResolvedValue({ data: { _id: '1', title: 'Bug1', description: 'desc', status: 'open' } })

  render(<App />)

  expect(screen.getByText(/MERN Bug Tracker/i)).toBeInTheDocument()

  const title = screen.getByPlaceholderText('Title')
  const desc = screen.getByPlaceholderText('Description')
  const button = screen.getByText('Report Bug')

  fireEvent.change(title, { target: { value: 'Bug1' } })
  fireEvent.change(desc, { target: { value: 'desc' } })
  fireEvent.click(button)

  // wait for optimistic render
  const created = await screen.findByText(/Bug1/)
  expect(created).toBeInTheDocument()
})
