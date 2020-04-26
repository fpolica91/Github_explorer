import React, { useState, useEffect, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import api from '../../services/api'
import { Title, Form, Repositories, Error } from './styles'

interface Repository {
  full_name: string
  description: string
  owner: {
    login: string
    avatar_url: string
  }
}

/**
 * @hasError sets red border upon error
 * @localStorage will save new Repository
 * @localstorage will listen to every change of repositories
 * @useState can take a function as a initial paramenter
 * @storagedRepos has something then return it, else empty array
 */

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('')
  const [inputError, setInputError] = useState('')
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storagedRepos = localStorage.getItem('@GithubExplorer:respositories')
    if (storagedRepos) {
      return JSON.parse(storagedRepos)
    } else {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:respositories',
      JSON.stringify(repositories)
    )
  }, [repositories])

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    if (!newRepo) {
      setInputError('Enter a repository name')
      return
    }
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`)
      const repository = response.data
      setRepositories([...repositories, repository])
      setNewRepo('')
      setInputError('')
    } catch (error) {
      setInputError(error.message)
    }
  }

  return (
    <>
      <Title>Dashboard</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="enter repository name"
          value={newRepo}
        />
        <button>View</button>
      </Form>
      <Error>{inputError && inputError}</Error>
      {repositories.map((repository) => (
        <Repositories key={repository.full_name}>
          <Link to={`/repository/${repository.full_name}`}>
            <img src={repository.owner.avatar_url} alt="User Avatar" />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        </Repositories>
      ))}
    </>
  )
}

export default Dashboard
