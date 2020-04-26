import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useRouteMatch, Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import logo from '../../assets/logoImage.svg'
import { Header, RepositoryInfo, Issues } from './styles'

interface RepositoryParams {
  repository: string
}

interface Repository {
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  owner: {
    login: string
    avatar_url: string
  }
}

interface Issue {
  id: number
  title: string
  html_url: string
  user: {
    login: string
  }
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>()
  const [repository, setRepository] = useState<Repository | null>(null)
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    async function loadIssues(): Promise<void> {
      const [repository, issues] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`),
      ])
      setRepository(repository.data)
      setIssues(issues.data)
    }
    loadIssues()
    /**
     * @useEffect use the name of param in use
     * @await Promise.all executes both async awaits at the same time.
     * @Promise race
     */
  }, [params.repository])
  return (
    <>
      <Header>
        <img src={logo} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Return
        </Link>
      </Header>

      {repository && (
        <RepositoryInfo key={repository.full_name}>
          <header>
            <img src={repository.owner.avatar_url} alt="Avatar" />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Open Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      <Issues>
        {issues.map((issue) => (
          <a href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  )
}

export default Repository
