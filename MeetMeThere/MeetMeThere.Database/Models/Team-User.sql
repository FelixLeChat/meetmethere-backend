CREATE TABLE [dbo].[Team-User]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [TeamId] INT NULL, 
    [UserId] INT NULL, 
    CONSTRAINT [FK_Team-User_Team] FOREIGN KEY (TeamId) REFERENCES Team(Id), 
    CONSTRAINT [FK_Team-User_User] FOREIGN KEY (UserId) REFERENCES "User"(Id)
)
