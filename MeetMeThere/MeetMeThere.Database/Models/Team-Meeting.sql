CREATE TABLE [dbo].[Team-Meeting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1,1), 
    [TeamId] INT NULL, 
    [MeetingId] INT NULL, 
    CONSTRAINT [FK_Team-Meeting_Team] FOREIGN KEY (TeamId) REFERENCES Team(Id), 
    CONSTRAINT [FK_Team-Meeting_Meeting] FOREIGN KEY (MeetingId) REFERENCES Meeting(Id)
)
